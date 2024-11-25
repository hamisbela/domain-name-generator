import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Coffee, Sparkles, Rocket, Star, Lightbulb, Globe2, ArrowRight } from 'lucide-react';
import { genAI } from '@/lib/gemini';

type DomainSuggestion = {
  name: string;
  extensions: string[];
};

export default function Home() {
  const [description, setDescription] = useState('');
  const [domains, setDomains] = useState<DomainSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateDomains = async () => {
    if (!description.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      if (!genAI) {
        throw new Error("API key not configured. Please add your Gemini API key to continue.");
      }
      
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Generate 5 creative, memorable, and brandable website domain names based on this description: ${description}. Consider SEO, memorability, and brand potential. Each name should be short, catchy, and unique. For each name, suggest multiple domain extensions (.com, .io, .co, .net, .org, .ai). Return only the domain names without extensions, one per line, without any additional text or explanations.`;
      
      const result = await model.generateContent(prompt);
      const nameList = result.response.text().split('\n').filter(name => name.trim());
      
      const domainSuggestions = nameList.map(name => ({
        name: name.toLowerCase(),
        extensions: ['.com', '.io', '.co', '.net', '.org', '.ai']
      }));
      
      setDomains(domainSuggestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating domain names');
      setDomains([]);
    } finally {
      setLoading(false);
    }
  };

  const getGoDaddyUrl = (domain: string, extension: string) => {
    return `https://www.godaddy.com/domainsearch/find?domainToCheck=${domain}${extension}`;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 py-4">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-transparent bg-clip-text leading-tight">
            AI Domain Name Generator ✨
          </h1>
          <p className="text-xl text-gray-600">
            Generate and check available domain names in seconds! 🌐
          </p>
        </div>
        
        <div className="gradient-border mb-8">
          <div className="p-8">
            <div className="space-y-6">
              <Textarea
                placeholder="✍️ Describe your project, brand, or business idea..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px] text-lg border-2 focus:border-cyan-400"
              />
              
              <Button 
                onClick={generateDomains}
                disabled={loading || !description.trim()}
                className="w-full text-lg py-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              >
                {loading ? (
                  <>
                    <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                    Creating Magic...
                  </>
                ) : (
                  <>
                    <Rocket className="mr-2 h-5 w-5" />
                    Generate Domain Names ✨
                  </>
                )}
              </Button>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>

        {domains.length > 0 && (
          <div className="space-y-6 mb-12">
            {domains.map((domain, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-cyan-200">
                <h3 className="text-xl font-semibold mb-4">{domain.name}</h3>
                <div className="space-y-2">
                  {domain.extensions.map((ext) => (
                    <a
                      key={ext}
                      href={getGoDaddyUrl(domain.name, ext)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button
                        variant="outline"
                        className="w-full justify-between text-left hover:bg-cyan-50 hover:text-cyan-700 group"
                      >
                        <div className="flex items-center gap-2">
                          <Globe2 className="h-4 w-4" />
                          <span className="font-medium">{domain.name}{ext}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-cyan-600">
                          <span>Check Availability</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Button>
                    </a>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}

        <Card className="p-8 bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 mb-16">
          <div className="text-center space-y-4">
            <Coffee className="h-12 w-12 mx-auto text-cyan-500" />
            <h2 className="text-2xl font-bold">Support Our Work ❤️</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Help us maintain and improve our AI tools by supporting our API & hosting costs. 
              Your contribution helps keep this tool free for everyone! 🙏
            </p>
            <a
              href="https://roihacks.gumroad.com/coffee"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                <Coffee className="mr-2 h-5 w-5" />
                Buy Us a Coffee ☕
              </Button>
            </a>
          </div>
        </Card>

        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl shadow-xl p-8 mb-16">
          <article className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-transparent bg-clip-text">
              AI Domain Name Generator: Find Your Perfect Domain Instantly ⚡
            </h2>
            
            <div className="space-y-6">
              <p className="text-gray-600 leading-relaxed">
                Our Free AI Domain Name Generator is the ultimate tool for finding the perfect domain name for your project. 
                Using advanced artificial intelligence, we help you discover unique, brandable domain names that will 
                make your online presence stand out.
              </p>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Star className="h-6 w-6 text-cyan-500" />
                  The #1 AI Domain Name Generator 🎯
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="mr-2">🌐</span>
                    <span>Instant domain name suggestions with availability check</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">🤖</span>
                    <span>AI-powered technology for brandable domain names</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">⚡</span>
                    <span>Multiple TLD options (.com, .io, .co, .net, .org, .ai)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✨</span>
                    <span>Smart suggestions based on your brand vision</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">💎</span>
                    <span>Free to use with instant domain registration</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-cyan-500" />
                  Why Choose Our AI Domain Name Generator? 💫
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Our AI-powered domain generator stands out by analyzing successful domains,
                  understanding naming patterns, and generating names that are:
                </p>
                <ul className="mt-4 space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span>🎯</span> Brandable and memorable
                  </li>
                  <li className="flex items-center gap-2">
                    <span>💡</span> Short and easy to type
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🌟</span> Perfect for social media
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🚀</span> Ready for instant registration
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-2xl font-semibold mb-4">Perfect For Every Project 🌐</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our AI domain name generator is perfect for:
                </p>
                <ul className="mt-4 space-y-2 text-gray-600">
                  <li>• Business websites and startups</li>
                  <li>• Personal blogs and portfolios</li>
                  <li>• E-commerce platforms</li>
                  <li>• SaaS products</li>
                  <li>• Online communities</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-2xl font-semibold mb-4">Expert Tips for Choosing Domain Names 🎯</h3>
                <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                  <li>Keep it short and memorable</li>
                  <li>Avoid hyphens and numbers</li>
                  <li>Consider brand protection</li>
                  <li>Check trademark availability</li>
                  <li>Choose the right TLD</li>
                </ol>
              </div>
            </div>
          </article>
        </div>

        <Card className="p-8 bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 mb-16">
          <div className="text-center space-y-4">
            <Coffee className="h-12 w-12 mx-auto text-cyan-500" />
            <h2 className="text-2xl font-bold">Love Our Free AI Domain Generator? Support Its Growth! 🚀</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Your support helps us maintain our AI infrastructure, improve the tool's capabilities,
              and keep it accessible to everyone. Every coffee counts! ☕
            </p>
            <div className="pt-2">
              <a
                href="https://roihacks.gumroad.com/coffee"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                  <Coffee className="mr-2 h-5 w-5" />
                  Buy Us a Coffee ☕
                </Button>
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}