import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User, Edit, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

interface UserProfileProps {
  onClose?: () => void;
  editable?: boolean;
}

export const UserProfile = ({ onClose, editable = false }: UserProfileProps) => {
  const { user, signOut } = useAuth();
  const [initials, setInitials] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (user?.displayName) {
      const nameParts = user.displayName.split(' ');
      const userInitials = nameParts.map((part: string) => part.charAt(0).toUpperCase()).join('');
      setInitials(userInitials);
      setFullName(user.displayName);
    } else if (user?.email) {
      setInitials(user.email.charAt(0).toUpperCase());
      setFullName('');
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      // Force page refresh to clear any cached state
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      toast("Error", { description: "Failed to sign out. Please try again." });
    }
    if (onClose) onClose();
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });
      
      if (updateError) throw updateError;
      
      toast("Profile updated", { description: "Your profile has been updated successfully." });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast("Error", { description: "Failed to update profile. Please try again." });
    }
  };

  if (!user) return null;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-12 w-12 border-2 border-primary">
          <AvatarImage src={user.photoURL} alt={user.displayName || user.email} />
          <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          {isEditing ? (
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              className="mb-2"
            />
          ) : (
            <CardTitle className="text-xl">
              {user.displayName || 'User'}
            </CardTitle>
          )}
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        {editable && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
          >
            {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Email</span>
            <span className="text-sm">{user.email}</span>
          </div>
          {/* Account status verification removed per requirement: direct access post-login */}
          {!editable && (
            <Button 
              variant="outline" 
              className="w-full mt-2"
              asChild
            >
              <Link to="/profile">View Full Profile</Link>
            </Button>
          )}
          <Button 
            variant="outline" 
            className="w-full mt-2 flex items-center gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};