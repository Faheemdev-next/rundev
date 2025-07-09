"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Loader2, Sparkles, Wand2, X } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userCredits, setUserCredits] = useState(3);

  // Load credits from localStorage (anonymous users)
  useEffect(() => {
    const stored = localStorage.getItem("free_credits");
    if (stored !== null) {
      setUserCredits(parseInt(stored));
    } else {
      localStorage.setItem("free_credits", "3");
    }
  }, []);

  // Keep localStorage updated
  useEffect(() => {
    localStorage.setItem("free_credits", userCredits.toString());
  }, [userCredits]);

  const submitPrompt = async () => {
    if (!prompt.trim()) return;

    if (userCredits <= 0) {
      router.push("/subscription");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setImageUrl(data.imageurl);
      setUserCredits((prev) => prev - 1);
    } catch (error) {
      console.error("Generation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      submitPrompt();
    }
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "ai-image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                AI Image Generator
              </h1>
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Transform your imagination into stunning visuals with the power of
              AI
            </p>
          </div>

          {/* Input */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm shadow-2xl mb-8">
            <CardContent className="p-8 space-y-6">
              <div className="relative">
                <Input
                  placeholder="Describe your vision..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="bg-black/50 border-gray-700 text-white placeholder-gray-500 text-lg py-6 px-6 rounded-xl focus:border-white focus:ring-2 focus:ring-white/20 transition-all"
                />
              </div>

              <Button
                onClick={submitPrompt}
                disabled={isLoading || !prompt.trim() || userCredits <= 0}
                className="w-full bg-white text-black hover:bg-gray-200 disabled:bg-gray-600 disabled:text-gray-400 py-6 text-lg font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Magic...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
                    {userCredits > 0
                      ? `Generate Image (${userCredits} left)`
                      : "No credits"}
                  </>
                )}
              </Button>

              <p className="text-center text-gray-400 text-sm">
                You have{" "}
                <span className="text-white font-bold">{userCredits}</span> free
                generation{userCredits !== 1 && "s"} left.
              </p>
            </CardContent>
          </Card>

          {/* Image Display */}
          {(imageUrl || isLoading) && (
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm shadow-2xl">
              <CardContent className="p-8">
                <div className="relative">
                  {isLoading ? (
                    <div className="aspect-square max-w-2xl mx-auto bg-black/50 rounded-xl border-2 border-dashed border-gray-700 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
                        <p className="text-gray-400 text-lg">
                          Crafting your masterpiece...
                        </p>
                        <div className="flex justify-center space-x-1">
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative group max-w-2xl mx-auto">
                      {/* Glow */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-white/20 via-white/10 to-white/20 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

                      {/* Buttons */}
                      <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => setImageUrl("")}
                          className="bg-black/60 hover:bg-black/80 p-2 rounded-full text-white"
                          title="Delete">
                          <X size={18} />
                        </button>
                        <button
                          onClick={downloadImage}
                          className="bg-black/60 hover:bg-black/80 p-2 rounded-full text-white"
                          title="Download">
                          <Download size={18} />
                        </button>
                      </div>

                      <Image
                        src={imageUrl}
                        alt="Generated artwork"
                        width={800}
                        height={800}
                        className="w-full rounded-xl shadow-2xl border border-gray-700"
                        priority
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Footer */}
          <div className="text-center mt-12">
            <p className="text-gray-500 text-sm">
              Powered by advanced AI • 3 free images per user
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
