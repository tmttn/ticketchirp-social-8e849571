
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload, User } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

interface AvatarUploadProps {
  avatarUrl?: string | null;
  username?: string | null;
  size?: "sm" | "md" | "lg";
  onAvatarChange?: (url: string) => void;
  className?: string;
}

export const AvatarUpload = ({ 
  avatarUrl, 
  username, 
  size = "md", 
  onAvatarChange,
  className 
}: AvatarUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  
  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-16 w-16",
    lg: "h-24 w-24"
  };
  
  const initials = username?.substring(0, 2).toUpperCase() || 'U';

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!e.target.files || e.target.files.length === 0 || !user) {
        throw new Error('You must select an image to upload.');
      }

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      // Upload file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (!data.publicUrl) {
        throw new Error('Failed to get public URL');
      }

      // Update profile
      if (onAvatarChange) {
        onAvatarChange(data.publicUrl);
      } else if (user) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: data.publicUrl })
          .eq('id', user.id);

        if (updateError) {
          throw updateError;
        }
      }

      toast.success('Avatar uploaded successfully');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Error uploading avatar');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Avatar className={`${sizeClasses[size]} relative`}>
        <AvatarImage src={avatarUrl || undefined} alt={username || 'Avatar'} />
        <AvatarFallback className="bg-muted">
          {initials}
        </AvatarFallback>
      </Avatar>
      
      {onAvatarChange !== undefined && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <label 
            htmlFor="avatar-upload" 
            className="bg-black/50 text-white rounded-full p-2 cursor-pointer flex items-center justify-center w-full h-full"
          >
            <Upload className="h-4 w-4" />
            <span className="sr-only">Upload avatar</span>
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </div>
      )}
      
      {uploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent text-primary rounded-full"></div>
        </div>
      )}
    </div>
  );
};
