import React, { useState } from 'react';
import {
  Headphones,
  Globe,
  ShieldCheck,
  Music,
  Zap,
  Star,
  ChevronDown,
  Instagram,
  Twitter,
  Linkedin
} from 'lucide-react';
import Navbar from './Navbar';


const languages = {
  az: {
    activeUsers: "Aktiv istifadəçilər",
    countries: "Ölkələr",
    artists: "Müğənnilər",
    tracks: "Mahnılar",
    aboutDesc: "Qabaqcıl texnologiya, qlobal əlaqə və səs üçün sarsılmaz ehtiras vasitəsilə musiqi təcrübəsini dəyişdirən.",
    exploreFeatures: "Kəşf Et",
    coreCommitment: "Əsas Öhdəliklərimiz",
  },
  en: {
    activeUsers: "Active Users",
    countries: "Countries",
    artists: "Artists",
    tracks: "Tracks",
    aboutDesc: "Revolutionizing music experience through cutting-edge technology, global connectivity, and an unwavering passion for sound.",
    exploreFeatures: "Explore Features",
    coreCommitment: "Our Core Commitments",
  }
};


const SpotifyAboutUs = () => {
  const [activeTeamMember, setActiveTeamMember] = useState(null);
  const AzerbaijanLang = languages.az;  
  const EnglishLang = languages.en;
  const [language, setLanguage] = useState(() => sessionStorage.getItem('language') || 'AZ');
  const [currentLang, setCurrentLang] = useState(language === "AZ" ? AzerbaijanLang : EnglishLang);

  
  const teamMembers = [
    {
      name: 'Elena Rodriguez',
      role: 'Founder & CEO',
      avatar: '🎵',
      expertise: ['Strategy', 'Innovation', 'Music Tech'],
      bio: 'A visionary leader reimagining the music technology landscape with innovative solutions and a global perspective.',
      social: {
        twitter: '#',
        instagram: '#',
        linkedin: '#'
      }
    },
    {
      name: 'Marcus Chen',
      role: 'Chief Technology Officer',
      avatar: '🎧',
      expertise: ['AI', 'Platform Architecture', 'Music Engineering'],
      bio: 'Technical mastermind driving our platform\'s groundbreaking technological innovations and user experiences.',
      social: {
        twitter: '#',
        instagram: '#',
        linkedin: '#'
      }
    },
    {
      name: 'Aria Thompson',
      role: 'Head of Music Curation',
      avatar: '🎸',
      expertise: ['A&R', 'Genre Diversity', 'Artist Relations'],
      bio: 'Global music expert with an unparalleled ability to discover and nurture emerging musical talent worldwide.',
      social: {
        twitter: '#',
        instagram: '#',
        linkedin: '#'
      }
    }
  ];

  const platformFeatures = [
    {
      icon: <Music className="w-12 h-12 text-green-400" />,
      title: 'Intelligent Discovery',
      description: 'Revolutionary algorithms that understand your unique musical DNA and connect you with artists that resonate with your personal style.',
      gradient: 'from-green-600 to-emerald-700'
    },
    {
      icon: <Globe className="w-12 h-12 text-blue-400" />,
      title: 'Global Connectivity',
      description: 'Bridging artists and listeners across continents and cultures with seamless integration and a borderless musical experience.',
      gradient: 'from-green-600 to-emerald-700'
    },
    {
      icon: <ShieldCheck className="w-12 h-12 text-purple-400" />,
      title: 'Artist Empowerment',
      description: 'Fair compensation and advanced tools for creative freedom, giving artists control over their work and connection to their audience.',
      gradient: 'from-green-600 to-emerald-700'
    }
  ];

  const stats = [
    { value: '40M+', label: currentLang.activeUsers },
    { value: '120+', label: currentLang.countries},
    { value: '5M+', label: currentLang.artists },
    { value: '250M+', label: currentLang.tracks }
  ];

  const closeTeamMemberModal = () => {
    setActiveTeamMember(null);
  };

  return (
    <div className='containerItems'>
    <Navbar></Navbar>
    <div className="relative">
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0% { opacity: 0.15; }
          50% { opacity: 0.25; }
          100% { opacity: 0.15; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-10px) translateX(5px); }
          50% { transform: translateY(0px) translateX(10px); }
          75% { transform: translateY(10px) translateX(5px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .slideInUp {
          animation: slideInUp 0.8s ease-out forwards;
        }
        .scaleIn {
          animation: scaleIn 0.6s ease-out forwards;
        }
        .pulseBackground {
          animation: pulse 4s infinite;
        }
        .bounceElement {
          animation: bounce 2s infinite;
        }
        .floatElement {
          animation: float 6s ease-in-out infinite;
        }
        .spinSlow {
          animation: spin 15s linear infinite;
        }
        .delaySmall { animation-delay: 0.2s; }
        .delayMedium { animation-delay: 0.4s; }
        .delayLarge { animation-delay: 0.6s; }
        
        .teamMember {
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .teamMember:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
        }
        
        .feature {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .feature:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
        }
        

        .scrollDown {
          animation: bounce 2s infinite;
        }
        
        .teamModal {
          animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>
      
   
      
      <div className="bg-gradient-to-br from-black via-gray-900 to-black min-h-screen overflow-hidden">
        
        <header className="relative h-screen flex items-center justify-center text-center overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute left-20 top-32 w-64 h-64 rounded-full bg-green-500/10 blur-3xl floatElement"></div>
          <div className="absolute right-20 bottom-32 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl floatElement delayMedium"></div>
          
   
          
          {/* Hero content */}
          <div className="relative z-10 px-6 py-12 space-y-8 max-w-5xl">
            <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-500 to-blue-500 mb-6 tracking-tight scaleIn">
              SwiftieApp
            </h1>
            
            <p className="text-2xl max-w-3xl mx-auto text-gray-200 leading-relaxed fadeIn delaySmall">
              {currentLang.aboutDesc}
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 pt-6 fadeIn delayMedium">
              <a href="#features" className="px-8 py-4 bg-green-500 hover:bg-green-600 text-green-500 font-bold rounded-full contactButton flex items-center gap-2">
                {currentLang.exploreFeatures} <ChevronDown className="w-5 h-5" />
              </a>
 
            </div>
            
            {/* Stats section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 fadeIn delayLarge">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4">
                  <div className="text-4xl font-bold text-green-400">{stat.value}</div>
                  <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Scroll down indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 scrollDown">
            <ChevronDown className="w-10 h-10 text-white opacity-70" />
          </div>
        </header>
        
        {/* Features Section */}
        <section id="features" className="py-24 bg-transparent relative">

          <div className="container mx-auto px-6 about-features-box">
            <h2 className="text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 tracking-tight fadeIn about-feature-title">
              {currentLang.coreCommitment}
            </h2>
            
            <div className="grid md:grid-cols-3 gap-10 ">
              {platformFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`
                    bg-gradient-to-br ${feature.gradient}
                    rounded-3xl p-8 relative overflow-hidden
                    feature slideInUp shadow-lg
                  `}
                  style={{ animationDelay: `${0.2 * index}s` }}
                >
                  <div className="absolute inset-0 bg-black opacity-80"></div>
                  
                  <div className="relative z-10 about-feauture-box">
                    <h3 className="text-2xl font-bold mb-4 text-white tracking-tight">
                      {feature.icon}  {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section id="team" className="py-24 bg-transparent relative">
  {/* Background Decorative Elements */}
  <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
    <div className="absolute -top-20 -left-20 w-72 h-72 bg-green-900/20 rounded-full blur-3xl"></div>
    <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-blue-900/20 rounded-full blur-3xl"></div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl"></div>
  </div>
  
  <div className="container mx-auto px-6 relative z-10">
    <h2 className="text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 tracking-tight fadeIn">
      Meet Our Innovators
    </h2>
    
    <div className="grid md:grid-cols-3 gap-10">
      {teamMembers && teamMembers.length > 0 ? (
        teamMembers.map((member, index) => (
          <div
            key={index}
            className={`teamMember cursor-pointer scaleIn delay${index === 0 ? 'Small' : index === 1 ? 'Medium' : 'Large'}`}
            onClick={() => setActiveTeamMember(member)}
          >
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl h-full">
              <div className="h-64 overflow-hidden relative flex items-center justify-center">
             
              </div>
              
              <div className="p-8 text-center relative">
                <h3 className="text-2xl font-bold text-green-400 mt-10 mb-2 tracking-tight">
                  {member.name}
                </h3>
                <p className="text-gray-400 mb-4 font-medium">{member.role}</p>
                
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {member.expertise.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-3 py-1 bg-gray-800 text-green-300 rounded-full text-xs font-medium"
                      style={{ animationDelay: `${0.1 * skillIndex}s` }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="text-[#1DB954] text-sm mb-6 line-clamp-3">{member.bio}</p>

                <div className="flex justify-center space-x-4 about-member-links">
                  <a href={member.social.twitter} className="text-[#1DB954] hover:text-green-400 transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href={member.social.instagram} className="text-[#1DB954] hover:text-green-400 transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href={member.social.linkedin} className="text-[#1DB954] hover:text-green-400 transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>

              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-400">No team members available</p>
      )}
    </div>
  </div>
</section>

        
        

      </div>
      
      

    </div>
    </div>
  );
};

export default SpotifyAboutUs;