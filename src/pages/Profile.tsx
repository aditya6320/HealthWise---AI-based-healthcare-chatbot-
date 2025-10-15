import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Profile as ProfileType, MedicalRecord } from '@/types/database';
import { Loader2, Upload, FileText, Trash2, Shield, LogOut } from 'lucide-react';

const Profile = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [medicalRecord, setMedicalRecord] = useState<MedicalRecord | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("personal");
  
  // Wait for auth to resolve before deciding access
  if (authLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Checking your session...</span>
        </div>
      </Layout>
    );
  }

  // Redirect if not logged in once auth is known
  if (!user) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    // Redirect to home if not logged in
    if (!user) {
      return;
    }
    
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Create or update profile immediately to ensure it exists
        const profileData = {
          id: user.id,
          email: user.email,
          full_name: user.displayName || '',
          avatar_url: user.photoURL || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        // Upsert profile to ensure it exists
        const { data: upsertedProfile, error: upsertError } = await supabase
          .from('profiles')
          .upsert(profileData, { 
            onConflict: 'id',
            ignoreDuplicates: false
          })
          .select()
          .single();
        
        if (upsertError) {
          console.error('Error upserting profile:', upsertError);
          
          // Fallback to fetch if upsert fails
          const { data: existingProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (!fetchError && existingProfile) {
            setProfile(existingProfile);
          } else {
            throw upsertError;
          }
        } else {
          // Use the upserted profile
          setProfile(upsertedProfile || profileData);
        }

        // Fetch medical record
        const { data: medicalData, error: medicalError } = await supabase
          .from('medical_records')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (!medicalError) {
          setMedicalRecord(medicalData);
        } else if (medicalError.code !== 'PGRST116') { // No rows returned
          throw medicalError;
        }

        // Fetch health documents
        const { data: documentsData, error: documentsError } = await supabase
          .from('health_documents')
          .select('*')
          .eq('user_id', user.id)
          .order('uploaded_at', { ascending: false });

        if (documentsError) throw documentsError;
        setDocuments(documentsData || []);

      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error",
          description: "Failed to load your profile data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, toast]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your personal information has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMedicalUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const medicalData = {
        ...medicalRecord,
        user_id: user.id,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('medical_records')
        .upsert(medicalData)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Medical information updated",
        description: "Your medical information has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating medical record:', error);
      toast({
        title: "Error",
        description: "Failed to update your medical information. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `health_documents/${fileName}`;

    setUploading(true);

    try {
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('user_documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = await supabase.storage
        .from('user_documents')
        .getPublicUrl(filePath);

      // Save document reference in database
      const { error: dbError } = await supabase
        .from('health_documents')
        .insert({
          user_id: user.id,
          document_name: file.name,
          document_type: file.type,
          document_url: urlData.publicUrl,
          is_private: true
        });

      if (dbError) throw dbError;

      // Refresh document list
      const { data: documentsData, error: documentsError } = await supabase
        .from('health_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false });

      if (documentsError) throw documentsError;
      setDocuments(documentsData || []);

      toast({
        title: "Document uploaded",
        description: "Your health document has been uploaded successfully.",
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Error",
        description: "Failed to upload your document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Clear the file input
      e.target.value = '';
    }
  };

  const handleDeleteDocument = async (id: string, filePath: string) => {
    try {
      // Delete from database
      const { error: dbError } = await supabase
        .from('health_documents')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('user_documents')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Update local state
      setDocuments(documents.filter(doc => doc.id !== id));

      toast({
        title: "Document deleted",
        description: "Your health document has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Error",
        description: "Failed to delete your document. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-8 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading your profile...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Your Health Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar with user info */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex flex-col items-center">
                    <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user.photoURL || undefined} alt={profile?.full_name || user.email} />
                    <AvatarFallback className="text-2xl">
                      {profile?.full_name?.split(' ').map(n => n[0]).join('') || user.email?.[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl text-center">{profile?.full_name || 'User'}</CardTitle>
                  <CardDescription className="text-center">{user.email}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mt-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => setActiveTab("personal")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Personal Information
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => setActiveTab("medical")}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Medical Information
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => setActiveTab("documents")}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Health Documents
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-destructive" 
                    onClick={signOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content area */}
          <div className="md:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="medical">Medical</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>
              
              {/* Personal Information Tab */}
              <TabsContent value="personal">
                <Card>
                  <form onSubmit={handleProfileUpdate}>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        Update your personal details and contact information.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input 
                            id="fullName" 
                            value={profile?.full_name || ''} 
                            onChange={(e) => setProfile({...profile!, full_name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" value={user.email} disabled />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input 
                            id="phone" 
                            value={profile?.phone_number || ''} 
                            onChange={(e) => setProfile({...profile!, phone_number: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dob">Date of Birth</Label>
                          <Input 
                            id="dob" 
                            type="date" 
                            value={profile?.date_of_birth || ''} 
                            onChange={(e) => setProfile({...profile!, date_of_birth: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <Select 
                            value={profile?.gender || ''} 
                            onValueChange={(value) => setProfile({...profile!, gender: value})}
                          >
                            <SelectTrigger id="gender">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea 
                          id="address" 
                          value={profile?.address || ''} 
                          onChange={(e) => setProfile({...profile!, address: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergency">Emergency Contact</Label>
                        <Input 
                          id="emergency" 
                          value={profile?.emergency_contact || ''} 
                          onChange={(e) => setProfile({...profile!, emergency_contact: e.target.value})}
                          placeholder="Name and phone number"
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit">Save Changes</Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
              
              {/* Medical Information Tab */}
              <TabsContent value="medical">
                <Card>
                  <form onSubmit={handleMedicalUpdate}>
                    <CardHeader>
                      <CardTitle>Medical Information</CardTitle>
                      <CardDescription>
                        Manage your medical details for better healthcare assistance.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bloodType">Blood Type</Label>
                          <Select 
                            value={medicalRecord?.blood_type || ''} 
                            onValueChange={(value) => setMedicalRecord({...medicalRecord!, blood_type: value})}
                          >
                            <SelectTrigger id="bloodType">
                              <SelectValue placeholder="Select blood type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A+">A+</SelectItem>
                              <SelectItem value="A-">A-</SelectItem>
                              <SelectItem value="B+">B+</SelectItem>
                              <SelectItem value="B-">B-</SelectItem>
                              <SelectItem value="AB+">AB+</SelectItem>
                              <SelectItem value="AB-">AB-</SelectItem>
                              <SelectItem value="O+">O+</SelectItem>
                              <SelectItem value="O-">O-</SelectItem>
                              <SelectItem value="unknown">Unknown</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastCheckup">Last Checkup</Label>
                          <Input 
                            id="lastCheckup" 
                            type="date" 
                            value={medicalRecord?.last_checkup || ''} 
                            onChange={(e) => setMedicalRecord({...medicalRecord!, last_checkup: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="height">Height (cm)</Label>
                          <Input 
                            id="height" 
                            type="number" 
                            value={medicalRecord?.height || ''} 
                            onChange={(e) => setMedicalRecord({...medicalRecord!, height: parseFloat(e.target.value)})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="weight">Weight (kg)</Label>
                          <Input 
                            id="weight" 
                            type="number" 
                            value={medicalRecord?.weight || ''} 
                            onChange={(e) => setMedicalRecord({...medicalRecord!, weight: parseFloat(e.target.value)})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="allergies">Allergies</Label>
                        <Textarea 
                          id="allergies" 
                          value={medicalRecord?.allergies?.join(', ') || ''} 
                          onChange={(e) => setMedicalRecord({
                            ...medicalRecord!, 
                            allergies: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                          })}
                          placeholder="List allergies separated by commas"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="conditions">Chronic Conditions</Label>
                        <Textarea 
                          id="conditions" 
                          value={medicalRecord?.chronic_conditions?.join(', ') || ''} 
                          onChange={(e) => setMedicalRecord({
                            ...medicalRecord!, 
                            chronic_conditions: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                          })}
                          placeholder="List chronic conditions separated by commas"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="medications">Current Medications</Label>
                        <Textarea 
                          id="medications" 
                          value={medicalRecord?.medications?.join(', ') || ''} 
                          onChange={(e) => setMedicalRecord({
                            ...medicalRecord!, 
                            medications: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                          })}
                          placeholder="List medications separated by commas"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Medical Notes</Label>
                        <Textarea 
                          id="notes" 
                          value={medicalRecord?.medical_notes || ''} 
                          onChange={(e) => setMedicalRecord({...medicalRecord!, medical_notes: e.target.value})}
                          placeholder="Any additional medical information"
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit">Save Medical Information</Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
              
              {/* Health Documents Tab */}
              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <CardTitle>Health Documents</CardTitle>
                    <CardDescription>
                      Securely store and manage your health records and documents.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Upload section */}
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium mb-2">Upload New Document</h3>
                        <div className="flex items-center gap-2">
                          <Input 
                            type="file" 
                            id="document" 
                            onChange={handleFileUpload}
                            disabled={uploading}
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          />
                          <Button disabled={uploading}>
                            {uploading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading
                              </>
                            ) : (
                              <>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload
                              </>
                            )}
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Supported formats: PDF, JPG, PNG, DOC, DOCX
                        </p>
                      </div>
                      
                      {/* Documents list */}
                      <div>
                        <h3 className="font-medium mb-2">Your Documents</h3>
                        {documents.length === 0 ? (
                          <p className="text-muted-foreground text-sm">No documents uploaded yet.</p>
                        ) : (
                          <div className="space-y-2">
                            {documents.map((doc) => (
                              <div key={doc.id} className="flex items-center justify-between border rounded-lg p-3">
                                <div className="flex items-center">
                                  <FileText className="h-5 w-5 mr-2 text-primary" />
                                  <div>
                                    <p className="font-medium">{doc.document_name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      Uploaded on {new Date(doc.uploaded_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    asChild
                                  >
                                    <a href={doc.document_url} target="_blank" rel="noopener noreferrer">View</a>
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleDeleteDocument(doc.id, doc.document_url.split('/').pop())}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;