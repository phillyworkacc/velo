import { toast } from "sonner";

export const copyToClipboard = async (text: string) => {
   try {
      navigator.clipboard.writeText(text);
      toast.success("Copied")
   } catch (e) {}
}

export const titleCase = (text: string) => {
   return `${text[0].toUpperCase()}${text.substring(1).toLowerCase()}`;
}

export const suffixS = (word: string, determiner: number) => {
   return (determiner == 1) ? `${word}` : `${word}s`;
}