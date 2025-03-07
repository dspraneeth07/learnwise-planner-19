
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { generateAIStudyPlan } from '@/services/geminiService';
import { toast } from 'sonner';

export type StudyGoal = 'exam' | 'skill' | 'daily' | 'custom';
export type DifficultyLevel = 'easy' | 'moderate' | 'easyToModerate' | 'aboveModerate' | 'tough';

export interface Subject {
  id: string;
  name: string;
  difficulty: DifficultyLevel;
}

export interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
}

export interface StudySession {
  id: string;
  subject: Subject;
  day: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
}

interface StudyContextType {
  goal: StudyGoal;
  setGoal: (goal: StudyGoal) => void;
  goalDetails: string;
  setGoalDetails: (details: string) => void;
  subjects: Subject[];
  addSubject: (subject: Subject) => void;
  updateSubject: (id: string, subject: Partial<Subject>) => void;
  removeSubject: (id: string) => void;
  timeSlots: TimeSlot[];
  addTimeSlot: (timeSlot: TimeSlot) => void;
  removeTimeSlot: (id: string) => void;
  studyPlan: StudySession[];
  generateStudyPlan: () => void;
  generateAIPlan: () => Promise<void>;
  isGeneratingPlan: boolean;
  clearStudyPlan: () => void;
  resetAll: () => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const useStudyContext = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudyContext must be used within a StudyProvider');
  }
  return context;
};

interface StudyProviderProps {
  children: ReactNode;
}

export const StudyProvider: React.FC<StudyProviderProps> = ({ children }) => {
  // Load data from localStorage or use defaults
  const [goal, setGoal] = useState<StudyGoal>(() => {
    const saved = localStorage.getItem('studyGoal');
    return saved ? JSON.parse(saved) : 'exam';
  });
  
  const [goalDetails, setGoalDetails] = useState<string>(() => {
    const saved = localStorage.getItem('goalDetails');
    return saved ? JSON.parse(saved) : '';
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('subjects');
    return saved ? JSON.parse(saved) : [];
  });

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(() => {
    const saved = localStorage.getItem('timeSlots');
    return saved ? JSON.parse(saved) : [];
  });

  const [studyPlan, setStudyPlan] = useState<StudySession[]>(() => {
    const saved = localStorage.getItem('studyPlan');
    return saved ? JSON.parse(saved) : [];
  });

  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('studyGoal', JSON.stringify(goal));
  }, [goal]);

  useEffect(() => {
    localStorage.setItem('goalDetails', JSON.stringify(goalDetails));
  }, [goalDetails]);

  useEffect(() => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('timeSlots', JSON.stringify(timeSlots));
  }, [timeSlots]);

  useEffect(() => {
    localStorage.setItem('studyPlan', JSON.stringify(studyPlan));
  }, [studyPlan]);

  const addSubject = (subject: Subject) => {
    setSubjects(prev => [...prev, subject]);
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects(prev => 
      prev.map(subject => subject.id === id ? { ...subject, ...updates } : subject)
    );
  };

  const removeSubject = (id: string) => {
    setSubjects(prev => prev.filter(subject => subject.id !== id));
  };

  const addTimeSlot = (timeSlot: TimeSlot) => {
    setTimeSlots(prev => [...prev, timeSlot]);
  };

  const removeTimeSlot = (id: string) => {
    setTimeSlots(prev => prev.filter(slot => slot.id !== id));
  };

  // Algorithm to generate a study plan based on subject difficulty and available time slots
  const generateStudyPlan = () => {
    if (subjects.length === 0 || timeSlots.length === 0) {
      return;
    }

    // This is a simplified algorithm - in a real app, this would be more sophisticated
    const newStudyPlan: StudySession[] = [];
    const difficultyWeight: Record<DifficultyLevel, number> = {
      easy: 1,
      easyToModerate: 2,
      moderate: 3,
      aboveModerate: 4,
      tough: 5
    };

    // Calculate total difficulty to determine proportional time allocation
    const totalDifficulty = subjects.reduce(
      (sum, subject) => sum + difficultyWeight[subject.difficulty], 
      0
    );

    // Sort subjects by difficulty (hardest first)
    const sortedSubjects = [...subjects].sort(
      (a, b) => difficultyWeight[b.difficulty] - difficultyWeight[a.difficulty]
    );

    // Process each time slot
    timeSlots.forEach(slot => {
      // Calculate slot duration in minutes
      const startTimeMinutes = parseInt(slot.startTime.split(':')[0]) * 60 + parseInt(slot.startTime.split(':')[1]);
      const endTimeMinutes = parseInt(slot.endTime.split(':')[0]) * 60 + parseInt(slot.endTime.split(':')[1]);
      let slotDuration = endTimeMinutes - startTimeMinutes;

      if (slotDuration <= 0) {
        return; // Skip invalid slots
      }

      // Assign time to subjects proportionally based on difficulty
      let currentStartTime = startTimeMinutes;
      sortedSubjects.forEach(subject => {
        // Calculate proportion of time to allocate to this subject
        const proportion = difficultyWeight[subject.difficulty] / totalDifficulty;
        const subjectMinutes = Math.round(slotDuration * proportion);
        
        if (subjectMinutes < 15) return; // Skip if allocated time is too short

        // Calculate end time for this subject's session
        const sessionEndTime = Math.min(currentStartTime + subjectMinutes, endTimeMinutes);
        
        if (sessionEndTime > currentStartTime) {
          // Format times as HH:MM
          const formatTime = (minutes: number) => {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
          };

          newStudyPlan.push({
            id: `session-${Math.random().toString(36).substr(2, 9)}`,
            subject,
            day: slot.day,
            startTime: formatTime(currentStartTime),
            endTime: formatTime(sessionEndTime),
            duration: sessionEndTime - currentStartTime
          });

          currentStartTime = sessionEndTime;
        }
      });
    });

    setStudyPlan(newStudyPlan);
  };

  // Generate study plan using the AI
  const generateAIPlan = async () => {
    if (subjects.length === 0 || timeSlots.length === 0) {
      toast.error("Please add at least one subject and time slot");
      return;
    }

    setIsGeneratingPlan(true);
    toast.info("Generating AI study plan...");

    try {
      const aiPlan = await generateAIStudyPlan(goal, goalDetails, subjects, timeSlots);
      
      if (aiPlan.length > 0) {
        setStudyPlan(aiPlan);
        toast.success("AI study plan generated successfully");
      } else {
        toast.error("Failed to generate AI plan, using built-in algorithm instead");
        generateStudyPlan();
      }
    } catch (error) {
      console.error("Error generating AI plan:", error);
      toast.error("Error generating AI plan, using built-in algorithm instead");
      generateStudyPlan();
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const clearStudyPlan = () => {
    setStudyPlan([]);
  };

  const resetAll = () => {
    setGoal('exam');
    setGoalDetails('');
    setSubjects([]);
    setTimeSlots([]);
    setStudyPlan([]);
  };

  return (
    <StudyContext.Provider
      value={{
        goal,
        setGoal,
        goalDetails,
        setGoalDetails,
        subjects,
        addSubject,
        updateSubject,
        removeSubject,
        timeSlots,
        addTimeSlot,
        removeTimeSlot,
        studyPlan,
        generateStudyPlan,
        generateAIPlan,
        isGeneratingPlan,
        clearStudyPlan,
        resetAll
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};
