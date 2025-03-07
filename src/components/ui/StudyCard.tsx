
import React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DifficultyLevel, Subject } from '@/context/StudyContext';

interface StudyCardProps {
  subject: Subject;
  startTime: string;
  endTime: string;
  duration: number;
  className?: string;
}

const StudyCard: React.FC<StudyCardProps> = ({
  subject,
  startTime,
  endTime,
  duration,
  className,
}) => {
  const difficultyColor: Record<DifficultyLevel, string> = {
    easy: 'bg-green-50 text-green-700 border-green-100',
    easyToModerate: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    moderate: 'bg-blue-50 text-blue-700 border-blue-100',
    aboveModerate: 'bg-purple-50 text-purple-700 border-purple-100',
    tough: 'bg-orange-50 text-orange-700 border-orange-100'
  };

  return (
    <div 
      className={cn(
        "rounded-lg p-3 border shadow-sm hover-card transition-all duration-300",
        difficultyColor[subject.difficulty],
        className
      )}
    >
      <div className="font-medium">{subject.name}</div>
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center text-sm opacity-75">
          <Clock className="h-3.5 w-3.5 mr-1" />
          {startTime}-{endTime}
        </div>
        <div className="text-sm opacity-75">
          {Math.floor(duration / 60)}h{duration % 60 > 0 ? ` ${duration % 60}m` : ''}
        </div>
      </div>
    </div>
  );
};

export default StudyCard;
