import { Lesson, LessonText } from '../types';

export interface LessonDataBundle {
  lesson: Lesson;
  text: LessonText;
}

export const ENGLISH_LESSONS: LessonDataBundle[] = [
  // Lesson 1: Home Row Keys
  {
    lesson: {
      id: 'eng-1-1',
      language: 'english',
      lesson_number: 1,
      sub_lesson_number: 1,
      lesson_code: 'english-1-1',
      title: 'Home Row: j, k, d, f',
      description: 'Learn the primary resting keys for your index and middle fingers.',
      sort_order: 1,
    },
    text: {
      id: 'text-eng-1-1',
      lesson_id: 'eng-1-1',
      content: 'fff jjj ddd kkk fd jk df kj fff jjj ddd kkk ff jj dd kk fj dk kf jd',
    },
  },
  {
    lesson: {
      id: 'eng-1-2',
      language: 'english',
      lesson_number: 1,
      sub_lesson_number: 2,
      lesson_code: 'english-1-2',
      title: 'Home Row: a, s, l, ;',
      description: 'Master the ring and pinky fingers on the home row.',
      sort_order: 2,
    },
    text: {
      id: 'text-eng-1-2',
      lesson_id: 'eng-1-2',
      content: 'aaa sss lll ;;; as l; sa ;l asdf jkl; a; sl dk fj asdf jkl;',
    },
  },
  {
    lesson: {
      id: 'eng-1-3',
      language: 'english',
      lesson_number: 1,
      sub_lesson_number: 3,
      lesson_code: 'english-1-3',
      title: 'Home Row: g, h & Words',
      description: 'Reach inward with index fingers to type g and h.',
      sort_order: 3,
    },
    text: {
      id: 'text-eng-1-3',
      lesson_id: 'eng-1-3',
      content: 'ggg hhh fg jh gh hg fad glad flash fall half flask salad dash flag hall',
    },
  },

  // Lesson 2: Top Row Keys
  {
    lesson: {
      id: 'eng-2-1',
      language: 'english',
      lesson_number: 2,
      sub_lesson_number: 1,
      lesson_code: 'english-2-1',
      title: 'Top Row: u, r, e, i',
      description: 'Reach upward from the home row for common vowels and consonants.',
      sort_order: 4,
    },
    text: {
      id: 'text-eng-2-1',
      lesson_id: 'eng-2-1',
      content: 'rrr uuu eee iii fr ju de ki red fur kid fire ride user rude reef ire',
    },
  },
  {
    lesson: {
      id: 'eng-2-2',
      language: 'english',
      lesson_number: 2,
      sub_lesson_number: 2,
      lesson_code: 'english-2-2',
      title: 'Top Row: w, o, q, p',
      description: 'Extend ring and pinky fingers up to the top row.',
      sort_order: 5,
    },
    text: {
      id: 'text-eng-2-2',
      lesson_id: 'eng-2-2',
      content: 'www ooo qqq ppp sw lo aq ;p wipe pool drop quiet proud wood paper prow',
    },
  },
  {
    lesson: {
      id: 'eng-2-3',
      language: 'english',
      lesson_number: 2,
      sub_lesson_number: 3,
      lesson_code: 'english-2-3',
      title: 'Top Row: t, y & Full Words',
      description: 'Reach upward and inward to master t and y.',
      sort_order: 6,
    },
    text: {
      id: 'text-eng-2-3',
      lesson_id: 'eng-2-3',
      content: 'ttt yyy ft jy try yet tyre duty write reply true youth poetry quality',
    },
  },

  // Lesson 3: Bottom Row Keys
  {
    lesson: {
      id: 'eng-3-1',
      language: 'english',
      lesson_number: 3,
      sub_lesson_number: 1,
      lesson_code: 'english-3-1',
      title: 'Bottom Row: v, m, b, n',
      description: 'Reach down with index fingers to type bottom row letters.',
      sort_order: 7,
    },
    text: {
      id: 'text-eng-3-1',
      lesson_id: 'eng-3-1',
      content: 'vvv mmm bbb nnn fv jm fb jn vine mind boat nine move beam banner vein',
    },
  },
  {
    lesson: {
      id: 'eng-3-2',
      language: 'english',
      lesson_number: 3,
      sub_lesson_number: 2,
      lesson_code: 'english-3-2',
      title: 'Bottom Row: c, x, z',
      description: 'Reach down with left middle, ring, and pinky fingers.',
      sort_order: 8,
    },
    text: {
      id: 'text-eng-3-2',
      lesson_id: 'eng-3-2',
      content: 'ccc xxx zzz dc sx az zone calm exit buzz cool extra voice zebra catch',
    },
  },
  {
    lesson: {
      id: 'eng-3-3',
      language: 'english',
      lesson_number: 3,
      sub_lesson_number: 3,
      lesson_code: 'english-3-3',
      title: 'Bottom Row: comma, period, slash',
      description: 'Practice right-hand punctuation on the bottom row.',
      sort_order: 9,
    },
    text: {
      id: 'text-eng-3-3',
      lesson_id: 'eng-3-3',
      content: 'k, l. ;/ cat, dog. run, stop. men, women. win, lose. fast, slow.',
    },
  },

  // Lesson 4: Capital Letters & Shift Key
  {
    lesson: {
      id: 'eng-4-1',
      language: 'english',
      lesson_number: 4,
      sub_lesson_number: 1,
      lesson_code: 'english-4-1',
      title: 'Shift with Right Hand',
      description: 'Hold the right shift key while typing left hand capitals.',
      sort_order: 10,
    },
    text: {
      id: 'text-eng-4-1',
      lesson_id: 'eng-4-1',
      content: 'Fred Dave Alice Sam Bob Greg Carol Frank Dan Adams George Foster Scott',
    },
  },
  {
    lesson: {
      id: 'eng-4-2',
      language: 'english',
      lesson_number: 4,
      sub_lesson_number: 2,
      lesson_code: 'english-4-2',
      title: 'Shift with Left Hand',
      description: 'Hold the left shift key while typing right hand capitals.',
      sort_order: 11,
    },
    text: {
      id: 'text-eng-4-2',
      lesson_id: 'eng-4-2',
      content: 'John Paul Mary Kyle Luke Noah Oliver Peter Ian James Nancy Quinn Mark',
    },
  },
  {
    lesson: {
      id: 'eng-4-3',
      language: 'english',
      lesson_number: 4,
      sub_lesson_number: 3,
      lesson_code: 'english-4-3',
      title: 'Mixed Capital Sentences',
      description: 'Alternate left and right Shift keys smoothly.',
      sort_order: 12,
    },
    text: {
      id: 'text-eng-4-3',
      lesson_id: 'eng-4-3',
      content: 'London Paris Tokyo Berlin Rome Madrid Ottawa Cairo Delhi Sydney Seoul',
    },
  },

  // Lesson 5: Numbers Row
  {
    lesson: {
      id: 'eng-5-1',
      language: 'english',
      lesson_number: 5,
      sub_lesson_number: 1,
      lesson_code: 'english-5-1',
      title: 'Numbers: 1, 2, 3, 4, 5',
      description: 'Reach up to the number keys with your left hand.',
      sort_order: 13,
    },
    text: {
      id: 'text-eng-5-1',
      lesson_id: 'eng-5-1',
      content: '1 2 3 4 5 12 34 51 25 142 351 423 512 12345 54321 314 251 432 514',
    },
  },
  {
    lesson: {
      id: 'eng-5-2',
      language: 'english',
      lesson_number: 5,
      sub_lesson_number: 2,
      lesson_code: 'english-5-2',
      title: 'Numbers: 6, 7, 8, 9, 0',
      description: 'Reach up to the number keys with your right hand.',
      sort_order: 14,
    },
    text: {
      id: 'text-eng-5-2',
      lesson_id: 'eng-5-2',
      content: '6 7 8 9 0 67 89 90 78 680 790 896 907 67890 09876 789 608 970 869',
    },
  },
  {
    lesson: {
      id: 'eng-5-3',
      language: 'english',
      lesson_number: 5,
      sub_lesson_number: 3,
      lesson_code: 'english-5-3',
      title: 'Full Numeric Practice',
      description: 'Combine numbers across both hands for telephone and date formats.',
      sort_order: 15,
    },
    text: {
      id: 'text-eng-5-3',
      lesson_id: 'eng-5-3',
      content: '1984 2024 1776 1492 365 24 60 3600 1024 2048 4096 8192 100 500 1000',
    },
  },

  // Lesson 6: Punctuation and Symbols
  {
    lesson: {
      id: 'eng-6-1',
      language: 'english',
      lesson_number: 6,
      sub_lesson_number: 1,
      lesson_code: 'english-6-1',
      title: 'Apostrophe and Quotes',
      description: 'Type contractions and direct quotes without hesitation.',
      sort_order: 16,
    },
    text: {
      id: 'text-eng-6-1',
      lesson_id: 'eng-6-1',
      content: 'it\'s don\'t can\'t won\'t "hello" "world" "typing is fun" "keep going"',
    },
  },
  {
    lesson: {
      id: 'eng-6-2',
      language: 'english',
      lesson_number: 6,
      sub_lesson_number: 2,
      lesson_code: 'english-6-2',
      title: 'Colons, Semicolons & Dashes',
      description: 'Master sentence separators and descriptive punctuation.',
      sort_order: 17,
    },
    text: {
      id: 'text-eng-6-2',
      lesson_id: 'eng-6-2',
      content: 'item: one; item: two; high-tech, self-taught, well-known, fast-paced',
    },
  },
  {
    lesson: {
      id: 'eng-6-3',
      language: 'english',
      lesson_number: 6,
      sub_lesson_number: 3,
      lesson_code: 'english-6-3',
      title: 'Exclamation & Question Marks',
      description: 'Express questions and excitement smoothly.',
      sort_order: 18,
    },
    text: {
      id: 'text-eng-6-3',
      lesson_id: 'eng-6-3',
      content: 'Are you ready? Yes, I am! Can you do it? Absolutely! Practice makes perfect!',
    },
  },

  // Lesson 7: Most Common Words
  {
    lesson: {
      id: 'eng-7-1',
      language: 'english',
      lesson_number: 7,
      sub_lesson_number: 1,
      lesson_code: 'english-7-1',
      title: 'Top Words: Group 1',
      description: 'High-frequency words that make up over 20% of written English.',
      sort_order: 19,
    },
    text: {
      id: 'text-eng-7-1',
      lesson_id: 'eng-7-1',
      content: 'the and that have for not with you this but his from they say her she or an will my one',
    },
  },
  {
    lesson: {
      id: 'eng-7-2',
      language: 'english',
      lesson_number: 7,
      sub_lesson_number: 2,
      lesson_code: 'english-7-2',
      title: 'Top Words: Group 2',
      description: 'Common verbs and prepositions for fluent continuous flow.',
      sort_order: 20,
    },
    text: {
      id: 'text-eng-7-2',
      lesson_id: 'eng-7-2',
      content: 'all would there their what out about who get which go me when make can like time no just',
    },
  },
  {
    lesson: {
      id: 'eng-7-3',
      language: 'english',
      lesson_number: 7,
      sub_lesson_number: 3,
      lesson_code: 'english-7-3',
      title: 'Top Words: Group 3',
      description: 'Essential words that build natural typing cadence.',
      sort_order: 21,
    },
    text: {
      id: 'text-eng-7-3',
      lesson_id: 'eng-7-3',
      content: 'him know take people into year your good some could them see other than then now look only come',
    },
  },

  // Lesson 8: Short Sentences
  {
    lesson: {
      id: 'eng-8-1',
      language: 'english',
      lesson_number: 8,
      sub_lesson_number: 1,
      lesson_code: 'english-8-1',
      title: 'Everyday Sentences',
      description: 'Natural phrasing with spaces, periods, and capitalization.',
      sort_order: 22,
    },
    text: {
      id: 'text-eng-8-1',
      lesson_id: 'eng-8-1',
      content: 'The sun shines bright. Birds sing in the trees. Every day is a fresh opportunity to learn.',
    },
  },
  {
    lesson: {
      id: 'eng-8-2',
      language: 'english',
      lesson_number: 8,
      sub_lesson_number: 2,
      lesson_code: 'english-8-2',
      title: 'Productivity Sentences',
      description: 'Workplace and technology themed short sentences.',
      sort_order: 23,
    },
    text: {
      id: 'text-eng-8-2',
      lesson_id: 'eng-8-2',
      content: 'Focus on your goals. Clear communication saves time. Great habits produce remarkable results.',
    },
  },
  {
    lesson: {
      id: 'eng-8-3',
      language: 'english',
      lesson_number: 8,
      sub_lesson_number: 3,
      lesson_code: 'english-8-3',
      title: 'Typing Wisdom',
      description: 'Quotes to instill touch typing discipline and calm.',
      sort_order: 24,
    },
    text: {
      id: 'text-eng-8-3',
      lesson_id: 'eng-8-3',
      content: 'Accuracy comes first, then speed follows naturally. Keep your fingers curved and wrists elevated.',
    },
  },

  // Lesson 9: Medium Paragraphs
  {
    lesson: {
      id: 'eng-9-1',
      language: 'english',
      lesson_number: 9,
      sub_lesson_number: 1,
      lesson_code: 'english-9-1',
      title: 'The Art of Touch Typing',
      description: 'Build endurance across continuous sentences.',
      sort_order: 25,
    },
    text: {
      id: 'text-eng-9-1',
      lesson_id: 'eng-9-1',
      content: 'Touch typing allows your mind to translate ideas straight onto the screen without looking down at the keyboard. Muscle memory develops through mindful repetition and regular practice sessions.',
    },
  },
  {
    lesson: {
      id: 'eng-9-2',
      language: 'english',
      lesson_number: 9,
      sub_lesson_number: 2,
      lesson_code: 'english-9-2',
      title: 'Technology and Writing',
      description: 'Paragraph focusing on varied vocabulary and punctuation.',
      sort_order: 26,
    },
    text: {
      id: 'text-eng-9-2',
      lesson_id: 'eng-9-2',
      content: 'Modern software engineering and creative writing both rely on rapid typing skills. When your fingers move effortlessly, your creative flow remains uninterrupted by mechanical friction.',
    },
  },
  {
    lesson: {
      id: 'eng-9-3',
      language: 'english',
      lesson_number: 9,
      sub_lesson_number: 3,
      lesson_code: 'english-9-3',
      title: 'Daily Practice Routine',
      description: 'Train stamina with a brisk continuous paragraph.',
      sort_order: 27,
    },
    text: {
      id: 'text-eng-9-3',
      lesson_id: 'eng-9-3',
      content: 'Fifteen minutes of dedicated typing practice every single day yields far greater progress than an occasional two-hour cramming session. Celebrate every increase in your WPM milestone.',
    },
  },

  // Lesson 10: Advanced Vocabulary
  {
    lesson: {
      id: 'eng-10-1',
      language: 'english',
      lesson_number: 10,
      sub_lesson_number: 1,
      lesson_code: 'english-10-1',
      title: 'Complex Letter Combinations',
      description: 'Tackle tricky double letters, awkward reaches, and diphthongs.',
      sort_order: 28,
    },
    text: {
      id: 'text-eng-10-1',
      lesson_id: 'eng-10-1',
      content: 'accommodation rhythm queue silhouette rendezvous conscience hierarchy questionnaire liaison vacuum',
    },
  },
  {
    lesson: {
      id: 'eng-10-2',
      language: 'english',
      lesson_number: 10,
      sub_lesson_number: 2,
      lesson_code: 'english-10-2',
      title: 'Academic and Scientific Words',
      description: 'Practice high-register terminology used in reports and articles.',
      sort_order: 29,
    },
    text: {
      id: 'text-eng-10-2',
      lesson_id: 'eng-10-2',
      content: 'hypothesis empirical methodology qualitative synthesis benchmark paradigm infrastructure resilience anomaly',
    },
  },
  {
    lesson: {
      id: 'eng-10-3',
      language: 'english',
      lesson_number: 10,
      sub_lesson_number: 3,
      lesson_code: 'english-10-3',
      title: 'Technical Vocabulary',
      description: 'Engineering, algorithmic, and computational terminology.',
      sort_order: 30,
    },
    text: {
      id: 'text-eng-10-3',
      lesson_id: 'eng-10-3',
      content: 'asynchronous concurrency polymorphism serialization encapsulation distributed orchestration telemetry optimization',
    },
  },

  // Lesson 11: Numbers & Symbols in Context
  {
    lesson: {
      id: 'eng-11-1',
      language: 'english',
      lesson_number: 11,
      sub_lesson_number: 1,
      lesson_code: 'english-11-1',
      title: 'Financial and Metric Data',
      description: 'Type currencies, percentages, and metrics smoothly.',
      sort_order: 31,
    },
    text: {
      id: 'text-eng-11-1',
      lesson_id: 'eng-11-1',
      content: 'In 2024, revenue grew by 18.5% to $4,250,000, while operating expenses decreased by 4.2% overall.',
    },
  },
  {
    lesson: {
      id: 'eng-11-2',
      language: 'english',
      lesson_number: 11,
      sub_lesson_number: 2,
      lesson_code: 'english-11-2',
      title: 'Dates, Times and Coordinates',
      description: 'Mixed numbers with hyphens, colons, and slashes.',
      sort_order: 32,
    },
    text: {
      id: 'text-eng-11-2',
      lesson_id: 'eng-11-2',
      content: 'The flight departed on 2024-10-15 at 14:35 UTC from Gate 42B, landing safely at 21:10.',
    },
  },
  {
    lesson: {
      id: 'eng-11-3',
      language: 'english',
      lesson_number: 11,
      sub_lesson_number: 3,
      lesson_code: 'english-11-3',
      title: 'Mixed Symbols Challenge',
      description: 'Special characters and syntax combinations.',
      sort_order: 33,
    },
    text: {
      id: 'text-eng-11-3',
      lesson_id: 'eng-11-3',
      content: 'Contact user@domain.com (ref #8932) with 100% accurate info: [id=459, status="ACTIVE", score=98.7].',
    },
  },

  // Lesson 12: Speed & Mastery Challenges
  {
    lesson: {
      id: 'eng-12-1',
      language: 'english',
      lesson_number: 12,
      sub_lesson_number: 1,
      lesson_code: 'english-12-1',
      title: 'Speed Sprint 1',
      description: 'High-speed flow test using dynamic prose.',
      sort_order: 34,
    },
    text: {
      id: 'text-eng-12-1',
      lesson_id: 'eng-12-1',
      content: 'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump.',
    },
  },
  {
    lesson: {
      id: 'eng-12-2',
      language: 'english',
      lesson_number: 12,
      sub_lesson_number: 2,
      lesson_code: 'english-12-2',
      title: 'Speed Sprint 2',
      description: 'Fluid continuous paragraph for 60+ WPM aspirants.',
      sort_order: 35,
    },
    text: {
      id: 'text-eng-12-2',
      lesson_id: 'eng-12-2',
      content: 'True mastery of typing is not merely about pressing keys rapidly; it is about cultivating effortless coordination between your thoughts and the screen. When you achieve this state of flow, work becomes pure joy.',
    },
  },
  {
    lesson: {
      id: 'eng-12-3',
      language: 'english',
      lesson_number: 12,
      sub_lesson_number: 3,
      lesson_code: 'english-12-3',
      title: 'Final English Graduation Test',
      description: 'The ultimate English benchmark lesson before earning your certificate.',
      sort_order: 36,
    },
    text: {
      id: 'text-eng-12-3',
      lesson_id: 'eng-12-3',
      content: 'Congratulations on reaching the final English typing lesson! By practicing consistently across all thirty-six lessons, you have built foundational muscle memory, rhythmic cadence, and dependable accuracy that will serve your professional career for years to come.',
    },
  },
];
