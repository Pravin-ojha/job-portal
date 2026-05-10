import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Search, Briefcase, TrendingUp, MapPin, 
  DollarSign, Star, CheckCircle, Globe, 
  Mail, Phone, ArrowRight, Zap, Code, Shield
} from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Search className="h-5 w-5 text-primary" />,
      title: 'Smart Search',
      description: 'Find your perfect job from thousands of listings using our AI-powered semantic search engine.',
    },
    {
      icon: <Zap className="h-5 w-5 text-primary" />,
      title: 'Instant Applications',
      description: 'Apply to multiple roles with a single click. Your profile is automatically matched to requirements.',
    },
    {
      icon: <Shield className="h-5 w-5 text-primary" />,
      title: 'Verified Companies',
      description: 'Every employer on our platform is strictly vetted to ensure quality and prevent spam.',
    },
  ];

  const featuredJobs = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'Google',
      logo: 'G',
      location: 'San Francisco, CA',
      salary: '$150k - $200k',
      type: 'Full-time',
      tags: ['React', 'Node.js', 'Cloud'],
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'Apple',
      logo: 'A',
      location: 'Cupertino, CA',
      salary: '$140k - $180k',
      type: 'Full-time',
      tags: ['Product', 'Analytics'],
    },
    {
      id: 3,
      title: 'Data Scientist',
      company: 'Meta',
      logo: 'M',
      location: 'Menlo Park, CA',
      salary: '$160k - $210k',
      type: 'Full-time',
      tags: ['ML', 'Python', 'SQL'],
    },
    {
      id: 4,
      title: 'Frontend Developer',
      company: 'Amazon',
      logo: 'A',
      location: 'Seattle, WA',
      salary: '$130k - $170k',
      type: 'Full-time',
      tags: ['React', 'TypeScript'],
    },
  ];

  const companies = [
    { name: 'Google', jobs: 248 },
    { name: 'Apple', jobs: 156 },
    { name: 'Microsoft', jobs: 189 },
    { name: 'Amazon', jobs: 312 },
    { name: 'Meta', jobs: 127 },
    { name: 'Tesla', jobs: 94 },
  ];

  const stats = [
    { label: 'Active Jobs', value: '5,000+' },
    { label: 'Companies', value: '1,200+' },
    { label: 'Job Seekers', value: '50,000+' },
    { label: 'Placements', value: '10,000+' },
  ];

  return (
    <div className="flex flex-col bg-white min-h-screen">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden border-b border-zinc-200">
        
        {/* The Firecrawl-style Grid Pattern Background */}
        <div 
          className="absolute inset-0 z-0" 
          style={{
            backgroundSize: '80px 80px',
            backgroundImage: `
              linear-gradient(to right, rgba(228, 228, 231, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(228, 228, 231, 0.3) 1px, transparent 1px)
            `,
            backgroundPosition: 'center top'
          }}
        ></div>

        {/* Intersection Dots */}
        <div 
          className="absolute inset-0 z-0" 
          style={{
            backgroundSize: '80px 80px',
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(161, 161, 170, 0.4) 1.5px, transparent 0)`,
            backgroundPosition: '-1px -1px'
          }}
        ></div>
        
        {/* Radial Spotlight to focus center and fade edges */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.9)_100%)]"></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/20 via-transparent to-white pointer-events-none"></div>

        {/* Floating Technical Decorators */}
        <div className="absolute top-20 left-10 md:left-24 text-[10px] font-mono text-zinc-400 opacity-60 hidden md:block">[ STATUS: 200 OK ]</div>
        <div className="absolute bottom-40 right-10 md:right-24 text-[10px] font-mono text-zinc-400 opacity-60 hidden md:block">{`{ scrape_jobs: true }`}</div>
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto px-6">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold tracking-wide text-primary mb-8 animate-in slide-in-from-bottom-4 duration-700 shadow-sm backdrop-blur-sm">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Over 5,000 new jobs added this week
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 mb-6 animate-in slide-in-from-bottom-6 duration-700 delay-100 leading-[1.1] z-10">
            Turn your career into <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary via-orange-500 to-yellow-400 drop-shadow-sm">LLM-ready data</span>... wait, no. <br/>
            Find your next role with <span className="text-primary">JobPortal</span>.
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-600 mb-10 max-w-2xl animate-in slide-in-from-bottom-8 duration-700 delay-200 z-10">
            The ultimate platform to discover opportunities, connect with top companies, and accelerate your career trajectory—built for modern professionals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in slide-in-from-bottom-10 duration-700 delay-300 z-10">
            <Button size="lg" className="h-12 px-8 text-base font-semibold shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all rounded-md" onClick={() => navigate('/jobs')}>
              Start searching
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base font-semibold bg-white/80 backdrop-blur-md border-zinc-200 hover:bg-zinc-50 rounded-md text-zinc-700 shadow-sm transition-all" onClick={() => navigate('/post-job')}>
              Post a Job
            </Button>
          </div>

          {/* Terminal / Code mockup snippet */}
          <div className="relative mt-20 w-full max-w-3xl animate-in fade-in duration-1000 delay-500 z-10 group">
            {/* Soft glow behind the terminal */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-orange-400/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition duration-500"></div>
            
            <div className="relative rounded-xl border border-zinc-200/50 bg-white/40 p-2 shadow-2xl backdrop-blur-xl">
              <div className="rounded-lg bg-[#0d0d0d] p-5 text-left font-mono text-sm leading-relaxed overflow-hidden relative border border-white/10 shadow-inner">
                {/* Subtle terminal noise/grain */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20 pointer-events-none"></div>
                
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#FF5F56] border border-black/20"></div>
                    <div className="h-3 w-3 rounded-full bg-[#FFBD2E] border border-black/20"></div>
                    <div className="h-3 w-3 rounded-full bg-[#27C93F] border border-black/20"></div>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-semibold tracking-wider flex items-center gap-2">
                    <Globe className="h-3 w-3" /> jobportal-api.js
                  </div>
                </div>
                
                <p className="text-zinc-300"><span className="text-[#FF7B72]">import</span> {'{ JobPortal }'} <span className="text-[#FF7B72]">from</span> <span className="text-[#A5D6FF]">'@jobportal/sdk'</span>;</p>
                <p className="text-zinc-300 mt-2"><span className="text-[#FF7B72]">const</span> app <span className="text-[#FF7B72]">=</span> <span className="text-[#FF7B72]">new</span> <span className="text-[#D2A8FF]">JobPortal</span>({'{'} apiKey: <span className="text-[#A5D6FF]">'jp_test_8f92k...'</span> {'}'});</p>
                <p className="text-[#8B949E] mt-5 italic">{'// Find your dream job in 2 lines of code'}</p>
                <p className="text-zinc-300"><span className="text-[#FF7B72]">const</span> jobs <span className="text-[#FF7B72]">=</span> <span className="text-[#FF7B72]">await</span> app.<span className="text-[#D2A8FF]">search</span>({'{'}</p>
                <div className="pl-4 border-l border-zinc-800 ml-2 mt-1">
                  <p className="text-zinc-300">role: <span className="text-[#A5D6FF]">'Software Engineer'</span>,</p>
                  <p className="text-zinc-300">location: <span className="text-[#A5D6FF]">'Remote'</span>,</p>
                  <p className="text-zinc-300">minSalary: <span className="text-[#79C0FF]">120000</span>,</p>
                  <p className="text-zinc-300">skills: [<span className="text-[#A5D6FF]">'React'</span>, <span className="text-[#A5D6FF]">'Node.js'</span>]</p>
                </div>
                <p className="text-zinc-300 mt-1">{'}'});</p>
                
                <p className="text-[#8B949E] mt-5 italic">{'// Response: 1,243 matching opportunities found in 0.24s.'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-16 bg-white border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-8">Trusted by forward-thinking companies</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {companies.map((company, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="font-bold text-xl text-foreground">{company.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">Why use JobPortal?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Everything you need to find the perfect job or hire the best talent, wrapped in a developer-friendly experience.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-8 rounded-2xl bg-white border border-border shadow-sm hover:shadow-md hover:border-primary/20 transition-all group">
                <div className="mb-6 inline-flex p-3 rounded-xl bg-primary/10 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-24 bg-white border-y border-border/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">Latest Opportunities</h2>
              <p className="text-lg text-muted-foreground">Discover fresh roles from top-tier engineering teams.</p>
            </div>
            <Button variant="outline" className="border-border text-foreground hover:bg-muted" onClick={() => navigate('/jobs')}>
              View all {stats[0].value} jobs
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {featuredJobs.map((job) => (
              <div 
                key={job.id} 
                onClick={() => navigate('/jobs')}
                className="p-6 rounded-xl bg-white border border-border shadow-sm hover:shadow-md hover:border-primary/40 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-lg bg-accent border border-border flex items-center justify-center font-bold text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {job.logo}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{job.title}</h3>
                        <p className="text-muted-foreground text-sm font-medium">{job.company}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5 font-medium">
                      <MapPin className="h-4 w-4 text-muted-foreground" /> {job.location}
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <DollarSign className="h-4 w-4 text-muted-foreground" /> {job.salary}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md text-xs font-semibold bg-accent text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-primary flex items-center">
                    Apply <ArrowRight className="ml-1 h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary/5 border-b border-primary/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6">
            Ready to crawl the job market?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of developers and companies already using JobPortal to build their engineering teams.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="h-12 px-8 text-base font-semibold shadow-lg shadow-primary/20" onClick={() => navigate('/signup')}>
              Get started for free
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 border-border text-foreground bg-white hover:bg-muted" onClick={() => navigate('/contact')}>
              Talk to sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-16 pb-8 border-t border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Briefcase className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-extrabold text-xl tracking-tight text-foreground">JobPortal</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                The modern platform for finding and hiring talent. Designed for speed, aesthetics, and results.
              </p>
              <div className="flex gap-4">
                <Globe className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                <Mail className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                <Phone className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-foreground">Product</h4>
              <ul className="flex flex-col gap-3 text-sm text-muted-foreground font-medium">
                <li><button onClick={() => navigate('/jobs')} className="hover:text-primary transition-colors">Browse Jobs</button></li>
                <li><button onClick={() => navigate('/post-job')} className="hover:text-primary transition-colors">Post a Job</button></li>
                <li><button className="hover:text-primary transition-colors">Companies</button></li>
                <li><button className="hover:text-primary transition-colors">Pricing</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-foreground">Resources</h4>
              <ul className="flex flex-col gap-3 text-sm text-muted-foreground font-medium">
                <li><button className="hover:text-primary transition-colors">Documentation</button></li>
                <li><button className="hover:text-primary transition-colors">Blog</button></li>
                <li><button className="hover:text-primary transition-colors">Help Center</button></li>
                <li><button className="hover:text-primary transition-colors">Contact</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-foreground">Legal</h4>
              <ul className="flex flex-col gap-3 text-sm text-muted-foreground font-medium">
                <li><button className="hover:text-primary transition-colors">Privacy Policy</button></li>
                <li><button className="hover:text-primary transition-colors">Terms of Service</button></li>
                <li><button className="hover:text-primary transition-colors">Cookie Policy</button></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border text-center text-sm font-medium text-muted-foreground">
            <p>© {new Date().getFullYear()} JobPortal. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;
