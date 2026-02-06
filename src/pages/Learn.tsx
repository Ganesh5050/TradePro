import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Play, Clock, CheckCircle, Star } from 'lucide-react';

const Learn = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const courses = [
    {
      id: 1,
      title: "Stock Market Basics",
      description: "Learn the fundamentals of stock market investing",
      level: "Beginner",
      duration: "2 hours",
      progress: 75,
      lessons: 8,
      completed: 6,
      rating: 4.8,
      thumbnail: "📚"
    },
    {
      id: 2,
      title: "Technical Analysis",
      description: "Master chart patterns and technical indicators",
      level: "Intermediate",
      duration: "4 hours",
      progress: 45,
      lessons: 12,
      completed: 5,
      rating: 4.9,
      thumbnail: "📊"
    },
    {
      id: 3,
      title: "Options Trading",
      description: "Advanced options strategies and risk management",
      level: "Advanced",
      duration: "6 hours",
      progress: 0,
      lessons: 15,
      completed: 0,
      rating: 4.7,
      thumbnail: "🎯"
    }
  ];

  const articles = [
    {
      title: "Understanding P/E Ratios",
      category: "Fundamentals",
      readTime: "5 min",
      author: "Market Expert"
    },
    {
      title: "Candlestick Patterns Guide",
      category: "Technical Analysis",
      readTime: "8 min",
      author: "Chart Analyst"
    },
    {
      title: "Risk Management Strategies",
      category: "Trading",
      readTime: "6 min",
      author: "Risk Manager"
    }
  ];

  return (
    <div className="min-h-screen px-4" style={{ paddingTop: '120px', backgroundColor: 'white' }}>
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Learn <span className="text-gradient-primary">Trading</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Master the Indian stock market with our comprehensive learning resources
          </p>
        </motion.div>

        {/* Featured Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6">Featured Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                className="trading-card group cursor-pointer"
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate('/login');
                  }
                }}
              >
                <div className="mb-4">
                  <div className="text-4xl mb-3">{course.thumbnail}</div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      course.level === 'Beginner' ? 'bg-success/20 text-success' :
                      course.level === 'Intermediate' ? 'bg-primary/20 text-primary' :
                      'bg-danger/20 text-danger'
                    }`}>
                      {course.level}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm">{course.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{course.description}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                        <span>{course.lessons} lessons</span>
                      </div>
                    </div>
                    {course.progress > 0 && (
                      <span className="text-primary">{course.completed}/{course.lessons}</span>
                    )}
                  </div>

                  {course.progress > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  )}

                  <Button className="w-full" variant={course.progress > 0 ? "default" : "outline"}>
                    {course.progress > 0 ? (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Continue Learning
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-4 h-4 mr-2" />
                        Start Course
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-6">Quick Reads</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <motion.div
                key={article.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="glass-card p-6 hover:border-primary/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium">
                    {article.category}
                  </span>
                  <span className="text-sm text-muted-foreground">{article.readTime}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground">By {article.author}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Learn;