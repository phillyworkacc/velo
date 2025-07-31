"use server"

const apiKey = process.env.YOUTUBE_API_KEY!;

export async function getYouTubeChannelInfo (channelUsername: string): Promise<YouTubeChannelInfo | null> {
   const channelId = await getYoutubeChannelId(channelUsername);
   const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`;
   try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      
      const data = await response.json();
      const channel = data.items[0];
      if (!channel) throw new Error("Channel not found");

      return {
         customUrl: channel.snippet.customUrl || null,
         profileImage: channel.snippet.thumbnails?.default?.url || null,
         subscriberCount: Number(channel.statistics.subscriberCount || 0),
         totalViewCount: Number(channel.statistics.viewCount || 0),
         totalVideos: Number(channel.statistics.videoCount || 0)
      };
   } catch (error) {
      console.error("Error fetching subscriber count");
      return null;
   }
}

export async function getYoutubeChannelId (channelUsername: string) {
   const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${channelUsername}&key=${apiKey}`;
   try {
      const response = await fetch(url);
      if (!response.ok) {
         throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      const channelId = data.items[0]?.id?.channelId;
      if (channelId === undefined) {
         throw new Error("Channel id not found");
      }
      return String(channelId);
   } catch (error) {
      console.log(error)
      console.error("Error fetching channel id");
      return null;
   }
}