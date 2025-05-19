import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectCoverflow } from "swiper/modules";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Clock,
  DollarSign,
  MapPin,
  Search,
  Star,
  TrendingUp,
  Users,
  CheckCircle,
  Award,
  Zap,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Avatar } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/effect-coverflow";
import Navbar from "../ui/navbar";
import { CandidateJob } from "@/types/job";
import { getTrendingJobsService } from "@/services/job";
import { getTimeAgo } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const featuredCompanies = [
  {
    id: 1,
    name: "Google",
    logo: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&auto=format&fit=crop&q=60",
    description: "Technology & Innovation",
    openPositions: 156,
    rating: 4.8,
    featured: true,
  },
  {
    id: 2,
    name: "Spotify",
    logo: "https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?w=800&auto=format&fit=crop&q=60",
    description: "Music & Entertainment",
    openPositions: 89,
    rating: 4.7,
    featured: false,
  },
  {
    id: 3,
    name: "Apple",
    logo: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=60",
    description: "Technology & Consumer Electronics",
    openPositions: 234,
    rating: 4.9,
    featured: true,
  },
  {
    id: 4,
    name: "Microsoft",
    logo: "https://images.unsplash.com/photo-1554200876-56c2f25224fa?w=800&auto=format&fit=crop&q=60",
    description: "Software & Cloud Solutions",
    openPositions: 178,
    rating: 4.6,
    featured: false,
  },
  {
    id: 5,
    name: "Amazon",
    logo: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=800&auto=format&fit=crop&q=60",
    description: "E-commerce & Technology",
    openPositions: 312,
    rating: 4.5,
    featured: true,
  },
  {
    id: 6,
    name: "Netflix",
    logo: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=60",
    description: "Entertainment & Streaming",
    openPositions: 76,
    rating: 4.7,
    featured: false,
  },
];

const categories = [
  {
    icon: <Briefcase />,
    name: "Technology",
    count: 1234,
    bgColor: "bg-blue-600",
    iconBg: "bg-blue-100",
    textColor: "text-blue-600",
  },
  {
    icon: <Building2 />,
    name: "Finance",
    count: 567,
    bgColor: "bg-green-600",
    iconBg: "bg-green-100",
    textColor: "text-green-600",
  },
  {
    icon: <Users />,
    name: "Marketing",
    count: 890,
    bgColor: "bg-purple-600",
    iconBg: "bg-purple-100",
    textColor: "text-purple-600",
  },
  {
    icon: <TrendingUp />,
    name: "Sales",
    count: 432,
    bgColor: "bg-orange-600",
    iconBg: "bg-orange-100",
    textColor: "text-orange-600",
  },
  {
    icon: <DollarSign />,
    name: "Accounting",
    count: 321,
    bgColor: "bg-teal-600",
    iconBg: "bg-teal-100",
    textColor: "text-teal-600",
  },
  {
    icon: <Award />,
    name: "Design",
    count: 654,
    bgColor: "bg-pink-600",
    iconBg: "bg-pink-100",
    textColor: "text-pink-600",
  },
  {
    icon: <Zap />,
    name: "Engineering",
    count: 789,
    bgColor: "bg-yellow-600",
    iconBg: "bg-yellow-100",
    textColor: "text-yellow-600",
  },
  {
    icon: <Clock />,
    name: "Part-time",
    count: 345,
    bgColor: "bg-indigo-600",
    iconBg: "bg-indigo-100",
    textColor: "text-indigo-600",
  },
];

const testimonials = [
  {
    id: 1,
    content:
      "Found my dream job through this platform in just 2 weeks! The AI-powered matching algorithm connected me with opportunities I wouldn't have found elsewhere.",
    author: "Sarah Johnson",
    role: "Senior Developer at Google",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60",
    companyLogo:
      "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: 2,
    content:
      "The best job search platform I've ever used. The interview preparation tools helped me land a position at a top tech company with a 40% salary increase!",
    author: "Michael Chen",
    role: "Product Designer at Apple",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=60",
    companyLogo:
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: 3,
    content:
      "This platform understands the modern job market like no other. Their career coaching services helped me pivot into tech from a completely different industry.",
    author: "Emily Rodriguez",
    role: "Marketing Manager at Spotify",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop&q=60",
    companyLogo:
      "https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: 4,
    content:
      "I was skeptical at first, but within a month I received three job offers with significantly better compensation packages than I could negotiate on my own.",
    author: "David Wilson",
    role: "Finance Director at Amazon",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60",
    companyLogo:
      "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=800&auto=format&fit=crop&q=60",
  },
];

const statsData = [
  { value: "10,000+", label: "Available Jobs", icon: <Briefcase /> },
  { value: "500+", label: "Partner Companies", icon: <Building2 /> },
  { value: "1M+", label: "Registered Candidates", icon: <Users /> },
  { value: "95%", label: "Success Rate", icon: <CheckCircle /> },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [trendingJobs, setTrendingJobs] = useState<CandidateJob[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsNavVisible(scrollPosition > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const getTrendingJobs = async () => {
      try {
        const response = await getTrendingJobsService();
        if (response.status == 200) {
          setTrendingJobs(response.data.trendingJobs);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getTrendingJobs();
  }, []);

  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Navigation */}
      <AnimatePresence>
        {isNavVisible && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 bg-white shadow-md z-50"
          >
            <Navbar />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900"></div>

        {/* Animated shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
            }}
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-50 blur-3xl"
          />
          <motion.div
            animate={{
              rotate: -360,
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
            }}
            className="absolute top-1/4 -right-32 w-80 h-80 rounded-full bg-gradient-to-l from-purple-500 to-indigo-600 opacity-40 blur-3xl"
          />
          <motion.div
            animate={{
              rotate: 180,
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
            }}
            className="absolute -bottom-32 left-1/3 w-64 h-64 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 opacity-30 blur-3xl"
          />
        </div>

        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&auto=format&fit=crop&q=60')] opacity-5 bg-cover bg-center mix-blend-overlay"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="pt-24 pb-20 md:pt-32 md:pb-28">
            <motion.div
              variants={heroVariants}
              initial="hidden"
              animate="visible"
              className="text-center max-w-3xl mx-auto"
            >
              <motion.div variants={itemVariants} className="mb-3">
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-1.5 text-sm font-medium">
                  #1 Job Platform
                </Badge>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
              >
                Find Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-100">
                  Dream Job
                </span>{" "}
                Today
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-xl text-blue-100 mb-8"
              >
                Connect with top employers and discover opportunities that match
                your skills and ambitions
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="bg-white p-3 md:p-4 rounded-xl shadow-2xl flex flex-col md:flex-row gap-4"
              >
                <div className="flex-1 relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <Input
                    placeholder="Job title or keyword"
                    className="pl-10 h-12 border-none ring-1 ring-gray-200 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <Input
                    placeholder="Location"
                    className="pl-10 h-12 border-none ring-1 ring-gray-200 focus:ring-blue-500"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                  />
                </div>
                <Button className="h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/20">
                  <Search size={18} className="mr-2" />
                  Search Jobs
                </Button>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center"
              >
                {statsData.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
                  >
                    <div className="w-10 h-10 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-blue-100">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 100"
            fill="white"
          >
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"></path>
          </svg>
        </div>
      </section>
      {/* Trending Jobs Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <Badge className="bg-blue-100 text-blue-600 mb-3">
                Latest Opportunities
              </Badge>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-bold text-gray-900"
              >
                Trending Jobs
              </motion.h2>
            </div>
            <Button
              variant="ghost"
              className="text-blue-600 gap-2"
              onClick={() => navigate("/jobs")}
            >
              View All <ArrowRight size={16} />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingJobs.map((job, index) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col relative">
                  {/* featured */}
                  {/* {job. && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-yellow-100 text-yellow-800 font-medium">
                        <Star
                          size={12}
                          className="mr-1 fill-yellow-500 text-yellow-500"
                        />
                        Featured
                      </Badge>
                    </div>
                  )} */}
                  <div className="p-6 flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <img
                          src={`${import.meta.env.VITE_S3_PATH}/${
                            job?.company?.logo
                          }`}
                          alt={job?.company?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {job?.title}
                        </h3>
                        <p className="text-gray-600">{job?.company?.name}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600">
                        <MapPin size={16} className="mr-2 text-gray-400" />
                        {job?.location}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Briefcase size={16} className="mr-2 text-gray-400" />
                        {job?.type}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <DollarSign size={16} className="mr-2 text-gray-400" />
                        {job?.salary}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      <Clock size={14} className="inline-block mr-1" />
                      {getTimeAgo(job?.createdAt)}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full p-0 w-8 h-8"
                      >
                        {/* <Heart
                          size={16}
                          className="text-gray-400 hover:text-red-500"
                        /> */}
                      </Button>
                      <Button
                        onClick={() => navigate(`/jobs/${job?._id}`)}
                        size="sm"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Featured Companies
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-blue-100 text-blue-600 mb-3">
              Top Employers
            </Badge>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              Featured Companies
            </motion.h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Join innovative companies that value talent and provide
              exceptional work environments
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCompanies.map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 relative h-full flex flex-col">
                  {company.featured && (
                    <div className="absolute top-3 right-3 z-10">
                      <Badge className="bg-blue-600 text-white">
                        <Star size={12} className="mr-1 fill-white" />
                        Top Rated
                      </Badge>
                    </div>
                  )}
                  <div className="h-32 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute bottom-3 left-3 z-10">
                      <div className="bg-white p-2 rounded-lg shadow-md w-12 h-12 flex items-center justify-center">
                        <span className="text-xl font-bold">
                          {company.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {company.name}
                      </h3>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star size={16} className="fill-yellow-500" />
                        <span className="font-medium">{company.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{company.description}</p>
                  </div>
                  <div className="px-6 pb-6 pt-2 mt-auto">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-600 font-medium flex items-center">
                        <Briefcase size={14} className="mr-1" />
                        {company.openPositions} open positions
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                      >
                        View Jobs
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}
      {/* Job Categories */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-blue-100 blur-3xl opacity-50"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-purple-100 blur-3xl opacity-30"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <Badge className="bg-blue-100 text-blue-600 mb-3">
              Explore Opportunities
            </Badge>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              Popular Categories
            </motion.h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Find the perfect role by exploring opportunities across different
              industries and job types
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 relative overflow-hidden h-full">
                  <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors"></div>

                  <div
                    className={`w-14 h-14 ${category.iconBg} rounded-xl flex items-center justify-center ${category.textColor} mb-5 relative z-10 group-hover:scale-110 transition-transform`}
                  >
                    {category.icon}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>

                  <div className="flex items-center justify-between">
                    <p className="text-gray-600">
                      {category.count.toLocaleString()} jobs
                    </p>
                    <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                      <ArrowRight
                        size={12}
                        className="text-gray-400 group-hover:text-white transition-colors"
                      />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=1200&auto=format&fit=crop&q=60')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>

        {/* Animated blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
            }}
            className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 opacity-30 blur-3xl"
          />
          <motion.div
            animate={{
              rotate: -360,
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
            }}
            className="absolute -bottom-32 right-1/4 w-80 h-80 rounded-full bg-gradient-to-l from-indigo-400 to-blue-500 opacity-20 blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <Badge className="bg-blue-200 text-blue-800 mb-3">
              Success Stories
            </Badge>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold text-white mb-4"
            >
              What Our Users Say
            </motion.h2>
            <p className="text-blue-100 max-w-xl mx-auto">
              Join thousands of professionals who have advanced their careers
              with our platform
            </p>
          </div>

          <Swiper
            modules={[Pagination, Autoplay, EffectCoverflow]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            effect="coverflow"
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: false,
            }}
            loop={true}
            slidesPerView={1}
            centeredSlides={true}
            spaceBetween={30}
            breakpoints={{
              640: {
                slidesPerView: 1.2,
              },
              768: {
                slidesPerView: 1.5,
              },
              1024: {
                slidesPerView: 2.5,
              },
            }}
            className="testimonials-swiper !pb-16"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden h-full">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <Avatar className="w-12 h-12 border-2 border-white">
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.author}
                          />
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-white">
                            {testimonial.author}
                          </h4>
                          <p className="text-sm text-blue-100">
                            {testimonial.role}
                          </p>
                        </div>
                        <div className="ml-auto">
                          <div className="w-8 h-8 rounded-full bg-white/10 p-1">
                            <img
                              src={testimonial.companyLogo}
                              alt={testimonial.role.split(" at ")[1]}
                              className="w-full h-full object-cover rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mb-6">
                        <div className="flex gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className="fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-blue-50 leading-relaxed">
                        {testimonial.content}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
      {/* Mobile App Section */}
      {/* <section className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-blue-100 text-blue-600 mb-3">
                Job Search On The Go
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Download Our Mobile App
              </h2>
              <p className="text-gray-600 mb-8">
                Take your job search to the next level with our mobile app. Get
                instant notifications about new job opportunities, apply on the
                go, and connect with employers from anywhere.
              </p>
              <div className="space-y-6">
                {[
                  {
                    icon: <CheckCircle className="text-green-500" />,
                    text: "Real-time job alerts based on your preferences",
                  },
                  {
                    icon: <CheckCircle className="text-green-500" />,
                    text: "One-tap application to streamline your job search",
                  },
                  {
                    icon: <CheckCircle className="text-green-500" />,
                    text: "Interview scheduling and reminders",
                  },
                  {
                    icon: <CheckCircle className="text-green-500" />,
                    text: "Personalized job recommendations",
                  },
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0">{feature.icon}</div>
                    <p className="text-gray-600">{feature.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button className="bg-black hover:bg-gray-800 text-white flex items-center gap-3 px-6 py-6 h-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-apple"
                  >
                    <path d="M12 20.94c1.5 0 2.75-.75 4-1.5 1.25-.75 2.25-1.5 3.5-1.5.75 0 1.25.25 1.5.25.25 0 .5-.25.5-.5 0-2.25-2.5-3-2.5-3 .25-1.25.5-1.5.5-2.75 0-1.75-1.5-3-3-3 0 0-.5.25-1.5.25s-1.5-.25-1.5-.25c-1.5 0-3 1.25-3 3 0 1.25.25 1.5.5 2.75 0 0-2.5.75-2.5 3 0 .25.25.5.5.5.25 0 .75-.25 1.5-.25 1.25 0 2.25.75 3.5 1.5 1.25.75 2.5 1.5 4 1.5Z"></path>
                    <path d="M8 13.25v-3.25a4 4 0 0 1 8 0v3.25"></path>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="font-medium">App Store</div>
                  </div>
                </Button>
                <Button className="bg-black hover:bg-gray-800 text-white flex items-center gap-3 px-6 py-6 h-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-play"
                  >
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">GET IT ON</div>
                    <div className="font-medium">Google Play</div>
                  </div>
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 mx-auto max-w-xs">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[3rem] p-3 shadow-2xl shadow-blue-500/20">
                  <div className="bg-black rounded-[2.5rem] overflow-hidden border-8 border-black">
                    <img
                      src="https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800&auto=format&fit=crop&q=60"
                      alt="JobHub Mobile App"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-100 rounded-full opacity-70 blur-2xl"></div>
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-indigo-100 rounded-full opacity-70 blur-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section> */}
      {/* Newsletter Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100 relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-blue-50 rounded-full"></div>
            <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-blue-50 rounded-full"></div>

            <div className="relative text-center">
              <Badge className="bg-blue-100 text-blue-600 mb-3">
                Stay Updated
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Get Personalized Job Alerts
              </h2>
              <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                Be the first to know about new job opportunities that match your
                skills and preferences
              </p>

              <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <Input
                  placeholder="Enter your email"
                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <Button className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white">
                  Subscribe
                </Button>
              </div>

              <p className="text-gray-500 text-sm mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-blue-400">JobHub</h3>
              <p className="text-gray-400 mb-6">
                Connecting talented professionals with innovative companies
                worldwide.
              </p>
              <div className="flex space-x-4">
                {["facebook", "twitter", "instagram", "linkedin"].map(
                  (social) => (
                    <a
                      key={social}
                      href="#"
                      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                    >
                      <span className="sr-only">{social}</span>
                      {/* Placeholder for social icons */}
                      <div className="w-5 h-5 rounded-full bg-white/20"></div>
                    </a>
                  )
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-6">For Job Seekers</h3>
              <ul className="space-y-4">
                {[
                  "Browse Jobs",
                  "Company Reviews",
                  "Salary Calculator",
                  "Career Advice",
                  "Upload Resume",
                  "Job Alerts",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-6">For Employers</h3>
              <ul className="space-y-4">
                {[
                  "Post a Job",
                  "Browse Candidates",
                  "Pricing Plans",
                  "Products",
                  "Employer Resources",
                  "ATS Integration",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-6">About Us</h3>
              <ul className="space-y-4">
                {[
                  "Our Story",
                  "Leadership Team",
                  "Careers",
                  "Press",
                  "Blog",
                  "Contact Us",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-sm mb-4 md:mb-0">
                © 2025 JobHub. All rights reserved.
              </p>
              <div className="flex space-x-6">
                {[
                  "Privacy Policy",
                  "Terms of Service",
                  "Cookie Policy",
                  "Accessibility",
                ].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-gray-500 text-sm hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
