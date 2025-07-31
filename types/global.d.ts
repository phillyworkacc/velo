type CredentialMethod = 'google' | 'credentials'
type SocialMedia = 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'linkedin'
type UserRoles = 'client' | 'editor' | 'admin'

type SocialMediaPlatform = {
   username: string;
   platform: SocialMedia;
   link: string;
}

type User = {
   userid: string;
   name: string;
   description: string;
   password: string;
   email: string;
   image: string;
   role: UserRoles;
   credentialMethod: CredentialMethod;
   onboarded: boolean;
   date: number;
}

type UserDetails = {
   userid: string;
   name: string;
   description: string;
   email: string;
   image: string;
   role: UserRoles;
   credentialMethod: CredentialMethod;
   onboarded: boolean;
   date: number;
}

type Onboarding = {
   userid: string;
   meetingReview: string;
   meetingRating: number;
   expectations: string;
   platforms: SocialMedia[];
}

type YouTubeChannelInfo = {
   customUrl: string | null;
   profileImage: string | null;
   subscriberCount: number;
   totalViewCount: number;
   totalVideos: number;
}

type ClientPost = {
   link: string;
   platform: SocialMedia;
   taskId: string;
   editorUserId: string;
   date: number;
}

type Client = {
   userid: string;
   googleDriveFolderLink: string;
   platforms: SocialMediaPlatform[];
   posts: ClientPost[];
   notes: string;
}

type ClientDetails = {
   userid: string;
   user: UserDetails;
   googleDriveFolderLink: string;
   platforms: SocialMediaPlatform[];
   posts: ClientPost[];
   notes: string;
}

type EditorTasks = {
   taskId: string;
   title: string;
   task: string;
   date: number;
}

type EditorPayments = {
   taskId: string;
   price: number;
   date: number;
}

type EditorTaskStatus = {
   taskId: string;
   googleDriveLink: string;
   date: number;
}

type Editor = {
   userid: string;
   googleDriveFolderLink: string;
   tasksCompleted: EditorTaskStatus[];
   tasksApproved: Omit<EditorTaskStatus, 'googleDriveLink'>[];
   payments: EditorPayments[];
}

type EditorDetails = {
   userid: string;
   user: UserDetails;
   googleDriveFolderLink: string;
   tasksCompleted: EditorTaskStatus[];
   tasksApproved: Omit<EditorTaskStatus, 'googleDriveLink'>[];
   payments: EditorPayments[];
}