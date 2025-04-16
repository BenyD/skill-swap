"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Book,
  Code,
  Languages,
  Music,
  Paintbrush,
  Rocket,
  Sparkles,
  Users,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

function AnimatedSection({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={stagger}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const scrollToFeatures = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center py-20 px-4">
        <AnimatedSection>
          <div className="relative z-10 text-center space-y-8 max-w-5xl mx-auto">
            <motion.div className="space-y-4" variants={fadeInUp}>
              <Badge
                variant="outline"
                className="border-purple-500/20 bg-purple-500/10 text-purple-300 backdrop-blur-sm"
              >
                ✨ The Future of Skill Exchange
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Exchange Skills,
                <br />
                Grow Together
              </h1>
            </motion.div>
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Connect with others to share your expertise and learn new skills
              in return. Join our community of lifelong learners today.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300"
                >
                  Explore Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="#features" onClick={scrollToFeatures}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Learn More
                </Button>
              </a>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="pt-8 flex flex-wrap items-center justify-center gap-4 text-gray-400"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full backdrop-blur-sm"
              >
                <Users className="h-5 w-5 text-purple-400" />
                <span>1000+ Users</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full backdrop-blur-sm"
              >
                <Book className="h-5 w-5 text-blue-400" />
                <span>500+ Skills</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full backdrop-blur-sm"
              >
                <Rocket className="h-5 w-5 text-pink-400" />
                <span>24/7 Support</span>
              </motion.div>
            </motion.div>
          </div>
        </AnimatedSection>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-4">
        <AnimatedSection>
          <div className="relative z-10 container mx-auto">
            <motion.div
              variants={fadeInUp}
              className="text-center space-y-4 mb-12"
            >
              <Badge
                variant="outline"
                className="border-blue-500/20 bg-blue-500/10 text-blue-300"
              >
                Features
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Why Choose Skill Swap?
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Sparkles,
                  title: "Skill Exchange",
                  description:
                    "Find people who want to learn what you know and learn from others in return.",
                  gradient: "from-blue-500 to-purple-500",
                },
                {
                  icon: Users,
                  title: "Community",
                  description:
                    "Join a vibrant community of learners and teachers from all walks of life.",
                  gradient: "from-purple-500 to-pink-500",
                },
                {
                  icon: Book,
                  title: "Flexible Learning",
                  description:
                    "Learn at your own pace, in your own way, with people who share your interests.",
                  gradient: "from-pink-500 to-red-500",
                },
              ].map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="group bg-gray-800/50 border-gray-800 hover:border-gray-700 backdrop-blur-sm transition-all duration-300">
                    <CardHeader>
                      <motion.div
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}
                      >
                        <feature.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <CardTitle className="text-gray-100">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Popular Skills Section */}
      <section className="relative py-20 px-4">
        <AnimatedSection>
          <div className="relative z-10 container mx-auto">
            <motion.div
              variants={fadeInUp}
              className="text-center space-y-4 mb-12"
            >
              <Badge
                variant="outline"
                className="border-pink-500/20 bg-pink-500/10 text-pink-300"
              >
                Popular Categories
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Explore Skills
              </h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Code,
                  title: "Programming",
                  description: "Web development, Python, JavaScript",
                  gradient: "from-blue-500 to-cyan-500",
                },
                {
                  icon: Languages,
                  title: "Languages",
                  description: "Spanish, French, Mandarin",
                  gradient: "from-purple-500 to-pink-500",
                },
                {
                  icon: Music,
                  title: "Music",
                  description: "Guitar, Piano, Singing",
                  gradient: "from-orange-500 to-red-500",
                },
                {
                  icon: Paintbrush,
                  title: "Design",
                  description: "UI/UX, Graphic Design, Photography",
                  gradient: "from-pink-500 to-purple-500",
                },
              ].map((skill) => (
                <motion.div
                  key={skill.title}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="group bg-gray-800/50 border-gray-800 hover:border-gray-700 backdrop-blur-sm transition-all duration-300">
                    <CardHeader>
                      <motion.div
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${skill.gradient} flex items-center justify-center mb-4`}
                      >
                        <skill.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <CardTitle className="text-gray-100">
                        {skill.title}
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        {skill.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
