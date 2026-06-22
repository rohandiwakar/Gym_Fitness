import { Member, Trainer, MembershipPlan, Exercise, WorkoutPlan, DietPlan, PaymentRecord, AttendanceRecord, Notification } from './types';

export const INITIAL_TRAINERS: Trainer[] = [
  {
    id: 't1',
    name: 'Coach Marcus',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB38MUXBavGbSCYUb27rAWmIY5SUUvNNBlxdNnSRxT_yUgxgtWw_RST3QjTll4HgWdOMxXosEpg8Zia2huef3eC6ULCpGwo1BhI1lIDtA6p8sqneh5UJVwwyQAd0js15P-Rx8xwLFK9Is_G2A5HKjaA-ARcbV6RCgbPpZrrUh0cNUY_YHEKLKP-uU_iVdBY8LEMURPX8rmkyzfy8mDbbM3NJ4zAMI1MZdbaoUIihIcRx08y6UJ_aE556Q39z4Lrjj1yK67BvobBAGM',
    specialization: 'Hypertrophy & Strength Training',
    experience: '8 Years',
    contactDetails: '+1 (555) 303-1284',
  },
  {
    id: 't2',
    name: 'Coach Elena',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSVrE4e5lMOeDWOZjUuI3XOOpJxIKVs5bMujp6QncpJiCFCEXGQWb-wPC0keF604b4sylCWCQj0VogH0NJRAzaATYS_m353-vkfXvvslhtdhwXVXDlCwtM-mWA1TIDbLHKQDxrzeOJrt4vLPrUhrWaPYz0ZA4l2GwixvUKkgUb5nuAzFE7o5i5-8U8e1meAi6hIpX_XEEpJhLOPlJKPEI6DJk3fuCYg4x1P3w-S9XIuANM8rteOZR_Iv6oLPO8umqAW6iqg_o0c_E',
    specialization: 'HIIT & Kinetic Performance Yoga',
    experience: '6 Years',
    contactDetails: '+1 (555) 700-1124',
  },
];

export const INITIAL_PLANS: MembershipPlan[] = [
  {
    id: 'p1',
    name: 'Pro Performance Annual',
    duration: '1 Year',
    price: 1200,
    description: 'Daily unlimited access to all HIIT areas, boutique gym studios, custom diet support and trainer assignment.',
  },
  {
    id: 'p2',
    name: 'Elite Plan',
    duration: '6 Months',
    price: 650,
    description: 'Gold level fitness plan includes standard access, advanced trainer assistance, and progress dashboards.',
  },
  {
    id: 'p3',
    name: 'Basic Monthly',
    duration: '1 Month',
    price: 150,
    description: 'Standard card entry to main weights zone during regular daytime off-peak slots.',
  },
];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'm1',
    fullName: 'Alex Morgan',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg_yIzA5_e5LB6g7Ii67eKg8B8hYX92RDitDXs5cixy-Z9jYhpdsUHX-fQS0cMHlHms06n6S3wXv5OqFM8xFfUM7_amQTDtMoDHEd1JaBxSbnlFVeAR4oi-TUOXQXBqnn3fcBmizAaumdWXAapuXuZtu7FdcOaAd83QV4Ogq3SSrzcwIWe-Y7KJtQ8SSyettENARDzJb4zgnMnQ5USgg1mJ48XNu_kuIiCBcmN9yZUyC6GvBlHPUSl20zlXSj-_R-MBhrycI4OLpk',
    phone: '+1 (555) 000-0012',
    email: 'alex.morgan@gymflow.com',
    gender: 'Male',
    dob: '1998-04-12',
    height: '182 cm',
    weight: 78.5,
    bmi: 22.4,
    weightHistory: [
      { date: 'May 01', weight: 81.2 },
      { date: 'May 10', weight: 80.5 },
      { date: 'May 20', weight: 79.8 },
      { date: 'May 30', weight: 79.1 },
      { date: 'Jun 10', weight: 78.8 },
      { date: 'Jun 22', weight: 78.5 },
    ],
    address: '842 Broadway, New York, NY',
    emergencyName: 'Sarah Morgan',
    emergencyRelation: 'Sister',
    emergencyPhone: '+1 (555) 000-0112',
    planId: 'p2',
    joiningDate: '2026-01-12',
    expiryDate: '2026-07-12',
    assignedTrainerId: 't1',
    status: 'Active',
  },
  {
    id: 'm2',
    fullName: 'Marcus Thorne',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHB0qSwHRdl9y1alzNQ7Ln9bUWTUyGnGe0I8d1A8UMbuOfBqgjDYv-Xt7LfgB-X8xFk0VHCuQEW9E-AkYKZRZrPU0lyrXXW1hFjk217AtGWYI4VsPvIE-FA3-dX6Tzq04ogz5PvsW9NfZxSyzrHvgtjVmcfxK1W4PQgD00N6SdCAMaUKdL7kdGCGcX1wbUX0fIXy4Y7zP4ZdhLNMa7-Xxdz9mIP45aZr8_UIxiNcdxsJHi8cbyn3IBID8eTfRwG1el_hllWxJhZJI',
    phone: '+1 (555) 012-3456',
    email: 'm.thorne@flowstate.com',
    gender: 'Male',
    dob: '1994-08-22',
    height: '185 cm',
    weight: 84.5,
    bmi: 23.2,
    weightHistory: [
      { date: 'Mar 12', weight: 88.0 },
      { date: 'Apr 12', weight: 86.0 },
      { date: 'May 12', weight: 87.0 },
      { date: 'Jun 12', weight: 84.5 },
    ],
    address: '711 Central Parkway, Brooklyn, NY',
    emergencyName: 'Sarah Thorne',
    emergencyRelation: 'Spouse',
    emergencyPhone: '+1 (555) 012-3457',
    planId: 'p1',
    joiningDate: '2026-01-12',
    expiryDate: '2027-01-11',
    assignedTrainerId: 't1',
    status: 'Active',
  },
  {
    id: 'm3',
    fullName: 'Jordan Smith',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDa2EyDf9JHG3w_fNccQa4Oe8pxsqmm1gaUXRzBdVqD6o5t5f5PhJo_ZfXcoeB733c-hmfrMJd2iBvHdCnI1O9Vg2-MykM-84o29nyW6VCHBBEJOAPGj-DyR7DbU7307KbgE5wVoHNoz-mkfd4ZO_OuV7iyeX6-n5ei0SAM8ZweRDts0KCkd-o_-BhEgR2QzQY3T7PT-eA3f9T80Stt5FmI6Jrn1Ya9sdTFfuyXKekaZb4VLSuTK-sJVcWqxA7LdrtBXyAtTW0aI8',
    phone: '+1 (555) 123-4567',
    email: 'j.smith@workout.org',
    gender: 'Male',
    dob: '1995-12-05',
    height: '178 cm',
    weight: 82.0,
    bmi: 25.8,
    weightHistory: [
      { date: 'Jan 10', weight: 85.0 },
      { date: 'Mar 10', weight: 84.0 },
      { date: 'Jun 10', weight: 82.0 },
    ],
    address: '223 Bowery St, New York, NY',
    emergencyName: 'Dave Smith',
    emergencyRelation: 'Father',
    emergencyPhone: '+1 (555) 123-9999',
    planId: 'p2',
    joiningDate: '2025-10-24',
    expiryDate: '2026-06-24', // Due in 2 days from June 22, 2026!
    assignedTrainerId: 't2',
    status: 'Active',
  },
  {
    id: 'm4',
    fullName: 'Elena Vance',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7za0oHy_8qnfWxuITY5ct_rn5tyGLO70vC-Uk6uSRXZjQ4QV5xmcds_ukO2KyrWNonwXVfumQHYwaGdEynO13ErXOzxg1ozyY2MMPzfOyv6jLl7B_nYClrhElViYJBMT5f2jIInqk7X1zLD78TfZCf84drdxhD4cMVkh0uG3kglj-wmFygWICpUx21dhIIJxEqpF0_uL2NHSY6n0RNJuzzO5Wxg3dOMd8RaIm84DohBOV2K1J8_k4snglj430CrAkOhSnx7hvUFo',
    phone: '+1 (555) 443-1234',
    email: 'elena.v@vancecorp.com',
    gender: 'Female',
    dob: '1997-09-14',
    height: '168 cm',
    weight: 62.4,
    bmi: 22.1,
    weightHistory: [
      { date: 'Jan 15', weight: 64.2 },
      { date: 'Mar 15', weight: 62.4 },
    ],
    address: '94 Black Mesa Dr, Astoria, NY',
    emergencyName: 'Eli Vance',
    emergencyRelation: 'Father',
    emergencyPhone: '+1 (555) 443-4321',
    planId: 'p1',
    joiningDate: '2026-02-15',
    expiryDate: '2027-02-15',
    assignedTrainerId: 't2',
    status: 'Active',
  },
  {
    id: 'm5',
    fullName: 'Alex Morgan',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg_yIzA5_e5LB6g7Ii67eKg8B8hYX92RDitDXs5cixy-Z9jYhpdsUHX-fQS0cMHlHms06n6S3wXv5OqFM8xFfUM7_amQTDtMoDHEd1JaBxSbnlFVeAR4oi-TUOXQXBqnn3fcBmizAaumdWXAapuXuZtu7FdcOaAd83QV4Ogq3SSrzcwIWe-Y7KJtQ8SSyettENARDzJb4zgnMnQ5USgg1mJ48XNu_kuIiCBcmN9yZUyC6GvBlHPUSl20zlXSj-_R-MBhrycI4OLpk',
    phone: '+1 (555) 987-6543',
    email: 'alexm90@gmail.com',
    gender: 'Female',
    dob: '1991-11-20',
    height: '170 cm',
    weight: 61.2,
    bmi: 21.2,
    weightHistory: [{ date: 'May 01', weight: 61.2 }],
    address: '40 Central Park W, New York, NY',
    emergencyName: 'John Morgan',
    emergencyRelation: 'Husband',
    emergencyPhone: '+1 (555) 987-1111',
    planId: 'p3',
    joiningDate: '2026-05-22',
    expiryDate: '2026-06-22', // Expired Today!
    assignedTrainerId: 't1',
    status: 'Expired',
  },
  {
    id: 'm6',
    fullName: 'Leo Rivera',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL_3qcGM0vyMoxLFD08-rnf4JRqyO-ejeCAJB5sISSNKg-5-7cXd8S8HQo_44hJMaSlJg8MsbraVOVdALZXJ3jvWRD-Vjrn-gcty6ntlCCK1zHO74SicQ6_ueft3e4rBOqEJZZovYPPkT97QrpB3hyx0HQd8fbKBdbt4zNOM7KlRI5240JPDxDKfARBbKPIz4P1vFsLTBWZpMW8OFT_ngpO5LXGqwiti6yM22cJKfBxDJ586GEk9qgBrNG8svcHSnnyltwYRmRAcU',
    phone: '+1 (555) 555-0909',
    email: 'rivera@flowmail.net',
    gender: 'Male',
    dob: '1993-01-30',
    height: '180 cm',
    weight: 81.0,
    bmi: 25.0,
    weightHistory: [{ date: 'May 10', weight: 81.0 }],
    address: '15 Ocean Ave, Brooklyn, NY',
    emergencyName: 'Maria Rivera',
    emergencyRelation: 'Mother',
    emergencyPhone: '+1 (555) 555-1010',
    planId: 'p2',
    joiningDate: '2026-04-27',
    expiryDate: '2026-06-27', // 5 days left from Jun 22
    assignedTrainerId: 't1',
    status: 'Active',
  },
];

export const INITIAL_EXERCISES: Exercise[] = [
  {
    id: 'e1',
    name: 'Barbell Back Squat',
    category: 'Legs',
    difficulty: 'Advanced',
    equipment: 'Barbell, squat rack',
    description: 'The fundamental movement for building massive lower body strength, core stability, and explosive leg power.',
    benefits: [
      'High recruitment of quadriceps, glutes, and hamstrings.',
      'Promotes release of natural growth hormone due to large muscle utilization.',
      'Saves joint longevity by reinforcing correct knee tracking patterns.',
    ],
    mistakes: [
      'Knees collapsing inward (valgus collapse).',
      'Lower back rounding out at the bottom of deep descent (butt wink).',
      'Lifting heels off the floor.',
    ],
    postureGuide: [
      'Feet positioned shoulder-width apart, toes flared slightly out.',
      'Barbell securely placed high on your upper trapezius muscles.',
      'Keep your absolute spine straight and center of mass balanced over middle foot.',
    ],
    instructions: [
      'Brace core deeply, unrack barbell, and take two solid paces backward.',
      'Inhale first. Lower hips down backward like sitting into a low concrete stool.',
      'Descend until thighs break below parallel, maintaining a locked spine.',
      'Drive aggressively from heels to return up, exhaling at the completion of descent.',
    ],
    safetyTips: [
      'Always utilize safety guard railings on your power rack.',
      'If form fails, let the barbell fall backward cleanly, and hop forward.',
    ],
    bgImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4qgpnmj_a2oQn9QDCI64KmsuugPXWcuoztPAhGcZeQFCRZzbjp-v4yWtFWHqc15LDCc2zdzdIXNy1EIVUby8ZgwuhVqrsm7DBnaoSO-Eg-NzeOwEGJPFuiy_2vwPKVu9C8jySHrkXvN5w3Sdm03QDJBxHagFpnmjfY1WRf3Qw5C4asmtsOfFmKjiPM6KZoBLNHL8I4O7oP2GaTvUNjHBvtEIzyYhqVgyMO2CFpQG7IoINE2k6XPFpn5q5lKQxeFadPQLsM_dxWB0',
  },
  {
    id: 'e2',
    name: 'Wide-Grip Pull-Up',
    category: 'Back',
    difficulty: 'Intermediate',
    equipment: 'Pull-up bar',
    description: 'Develop a wide, athletic V-tapered back while improving absolute bodyweight pulling mechanics.',
    benefits: [
      'Targets latissimus dorsi, rhomboids, and lower traps.',
      'Improves raw grip strength and scapular depression mobility.',
    ],
    mistakes: [
      'Kicking legs or using momentum (kipping).',
      'Partial repetitions not clearing chin above bar.',
    ],
    postureGuide: [
      'Hands placed wider than shoulder-width, palms facing away (pronated grip).',
      'Keep chest elevated and neck neutral.',
    ],
    instructions: [
      'Hang with fully extended arms, relaxing neck.',
      'Retract shoulder blades downwards and pull elbows hard toward your rib cage.',
      'Bring chest near bar height and clear your chin fully.',
      'Controlled eccentric release back down to a dead hang position.',
    ],
    safetyTips: [
      'Secure grip. If fatigue kicks in, step down instead of jumping and slipping.',
    ],
    bgImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfniePsWI82s3_Clli-KrOLiKIFnR7S40SJ8p7ob_rAGAdFzPAfUrFHHfWrjCp7KL_7NFemme0CZO7FfmLW0d0q-Vb-94gx4OAHU3ER_KojZsv661o8W7QyHASGoEbN12xb4MBbCuSAHso36tCgkqjsnRsYdgQZUscWflsjGg-FFIaF3tpuw5V6REwfppKz6Dzzzwkzm4UQao8dsKXdRKNXdArJhJK4jD6YvBQjfeGuvrtdI1YzECOcxJlQ8o5wEEVTTqN1D4ktLs',
  },
  {
    id: 'e3',
    name: 'Dumbbell Chest Press',
    category: 'Chest',
    difficulty: 'Beginner',
    equipment: 'Bench, Dumbbells',
    description: 'A versatile fundamental compound movement for chest hypertrophy and absolute pressing stability.',
    benefits: [
      'Wider range of motion than flat barbell press.',
      'Prevents lateral strength imbalances by forcing independent arm control.',
    ],
    mistakes: [
      'Over-arching spine of the bench.',
      'Banging dumbbells together violently at top structural point.',
    ],
    postureGuide: [
      'Sit on flat bench, position feet firmly on the concrete floor.',
      'Retract scapulae back and depress shoulders downwards into the upholstery.',
    ],
    instructions: [
      'Lay flat holding dumbbells above chest block, arms locked straight.',
      'Lower weights gracefully until elbows reach a 90-degree angle slightly below chest line.',
      'Drive weight directly back up to starting position, centering squeeze across pectorals.',
    ],
    safetyTips: [
      'Always have a reliable spotter if utilizing lifting weights above 75% max effort.',
    ],
    bgImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArMrf1AiaDrN-i8uQbWaK97fuBkISMUUsJ2dT3ZWbEeFyhwnpQwfdtzPaZI2xLq_EiUphnlp1HuIHAIKP2i1Z5mhEvY9QQjjladBuUjkGCSXcBCWhROiQ-83IDEt4VaM2Fjht8gr-H4j7Eavf0kEQA7YKZc2ZEKPT-TQ4kfFZLftjO88QxGsOwydikWBal6ChsJwYufYdNTCmKY8RVMs9-HWx3ze03WgxQYCONITjoCwY3BG9OEi7qrTObBsDfKgvXJOOUtPz5kiw',
  },
  {
    id: 'e4',
    name: 'Battle Rope Slams',
    category: 'Functional',
    difficulty: 'Intermediate',
    equipment: 'Heavy battle ropes',
    description: 'High-intensity conditioning sequence that incinerates visceral fat and blasts cardiovascular limits.',
    benefits: [
      'Combines high caloric burn with zero high-impact joint loading.',
      'Strengthens core, shoulders, and grip endurance simultaneously.',
    ],
    mistakes: [
      'Standing completely upright with locked knees.',
      'Using only arms instead of driving movement from core and hips.',
    ],
    postureGuide: [
      'Slight athletic quarter-squat position, feet planted wider than hips.',
      'Neutral back core alignment throughout the active interval.',
    ],
    instructions: [
      'Grasp rope ends cleanly. Drive both arms skyward to lift rope loops.',
      'Forcefully pull arms downward, slamming ropes into the floor.',
      'Generate alternate wave patterns rapidly, alternating arms.',
    ],
    safetyTips: [
      'Stand at appropriate slack distance so waves flow efficiently without yanking anchors.',
    ],
    bgImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCemj-B0VLn_YSwHveFER_FPZiHv2PaHYHim8H5t78CsPmovQaqtX-2TK65y-dqm0nDRRpsY_CGnDBajtul4Of-vZIedNx16rzVCSLqrO59eeXLJ5emkFw0WZiNRVpvGeoMTWysFrL9pxiAXOew4mbZBpjUTGuFmpkt50HtJqcv6RTVzBQwmU1F9LCawV0da483umHEGP0Haorp2WYTW1EPG5UmPnPnWQMT41VN4FvxkMu7CgN9dotdx0tD1yvIs5VqD0CuoHR_7ns',
  },
  {
    id: 'e5',
    name: 'Conventional Deadlift',
    category: 'Core',
    difficulty: 'Pro',
    equipment: 'Barbell, Olympic heavy plates',
    description: 'The ultimate measuring meter of absolute human strength. Engages virtually the entire posterior musculoskeletal chain.',
    benefits: [
      'Strengthens erector spinae, glutes, hamstrings, and traps.',
      'Triggers maximum central nervous system activation for muscle building.',
    ],
    mistakes: [
      'Letting upper or lower back round under high loads.',
      'Leaning back way too far at the locked out point structural apex.',
    ],
    postureGuide: [
      'Stand center of the bar, shins approximately 1 inch away from metal steel.',
      'Hinge hips backwards holding bar with tight overhand or mixed grip.',
    ],
    instructions: [
      'Brace the abdominal wall deeply. Pull slack out of the barbell first (audible click).',
      'Drive legs hard through platform concrete floor, rising smoothly directly upwards.',
      'Keep barbell close, letting it guide up shins and thigh lines to full lock.',
      'Push hips back carefully to descend the heavy bar in a straight line path.',
    ],
    safetyTips: [
      'Ensure flat shoes or barefoot posture to keep solid mechanical leverage.',
    ],
    bgImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhkO7VbFcAFr6HQ4iydcW2UzGy8WbP2l2BwqRWVlWMFCfl7uB55nm28nObRr3gJ6Wd1M36VpoMwaDTdYj9rRvLHIQpo8I7x3bHUdiw4QtMjSSoDIRa1-5Vz-PDgydEbHcfPKrZBB6dPLUIOxrlUTnbYuGan89UgbHhNbYedjHtTntmnit4Vd0XwMkRrqIJ40lHDg-VFeGxXlcWEYh5Bi0_jm_LFVryk29oekHFiYPq20GnquVrIAxbcmuLh9hxJxXE8-ETElwSzxU',
  },
];

export const INITIAL_WORKOUTS: WorkoutPlan[] = [
  {
    id: 'w1',
    name: 'Push Day - Hypertrophy',
    goal: 'Muscle Gain',
    durationWeeks: 8,
    exercises: [
      { exerciseId: 'e3', exerciseName: 'Dumbbell Chest Press', sets: 4, reps: '8-12', restSeconds: 90, bgImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArMrf1AiaDrN-i8uQbWaK97fuBkISMUUsJ2dT3ZWbEeFyhwnpQwfdtzPaZI2xLq_EiUphnlp1HuIHAIKP2i1Z5mhEvY9QQjjladBuUjkGCSXcBCWhROiQ-83IDEt4VaM2Fjht8gr-H4j7Eavf0kEQA7YKZc2ZEKPT-TQ4kfFZLftjO88QxGsOwydikWBal6ChsJwYufYdNTCmKY8RVMs9-HWx3ze03WgxQYCONITjoCwY3BG9OEi7qrTObBsDfKgvXJOOUtPz5kiw', category: 'Chest' },
      { exerciseId: 'e1', exerciseName: 'Barbell Back Squat', sets: 4, reps: '8-12', restSeconds: 120, bgImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4qgpnmj_a2oQn9QDCI64KmsuugPXWcuoztPAhGcZeQFCRZzbjp-v4yWtFWHqc15LDCc2zdzdIXNy1EIVUby8ZgwuhVqrsm7DBnaoSO-Eg-NzeOwEGJPFuiy_2vwPKVu9C8jySHrkXvN5w3Sdm03QDJBxHagFpnmjfY1WRf3Qw5C4asmtsOfFmKjiPM6KZoBLNHL8I4O7oP2GaTvUNjHBvtEIzyYhqVgyMO2CFpQG7IoINE2k6XPFpn5q5lKQxeFadPQLsM_dxWB0', category: 'Legs' },
    ],
  },
];

export const INITIAL_DIETS: DietPlan[] = [
  {
    id: 'd1',
    name: 'Strict Weight Loss Diet',
    goal: 'Weight Loss',
    meals: [
      {
        mealName: 'Morning Protein Oats',
        description: 'Rolled steel-cut oats, scoop of whey isolates, handful of frozen blueberries.',
        calories: 380,
        protein: 30,
        carbs: 45,
        fats: 6,
        time: '08:00 AM',
      },
      {
        mealName: 'Protein Power Bowl',
        description: 'Grilled skinless chicken breast, brown organic rice, sliced broccoli florets.',
        calories: 540,
        protein: 42,
        carbs: 55,
        fats: 12,
        time: '12:30 PM',
      },
    ],
  },
  {
    id: 'd2',
    name: 'Lean Bulk Muscle Gainer',
    goal: 'Muscle Gain',
    meals: [
      {
        mealName: 'Big Morning Egg Platter',
        description: '3 organic whole eggs, sliced avocado toast, smoked salmon fillet side.',
        calories: 680,
        protein: 45,
        carbs: 50,
        fats: 25,
        time: '07:30 AM',
      },
    ],
  },
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  { id: 'pay1', memberName: 'Sarah Chen', planName: 'Annual Renewal', amount: 1200, date: 'May 12, 2026', status: 'Paid' },
  { id: 'pay2', memberName: 'Mike Ross', planName: 'Add-on: Protein Pack', amount: 45, date: 'Jun 21, 2026', status: 'Pending' },
  { id: 'pay3', memberName: 'Emma Watson', planName: 'Monthly Duo', amount: 180, date: 'Jun 12, 2026', status: 'Paid' },
  { id: 'pay4', memberName: 'Marcus Thorne', planName: 'Pro Performance Annual', amount: 1200, date: 'Jan 12, 2026', status: 'Paid' },
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  { id: 'att1', memberId: 'm2', memberName: 'Marcus Thorne', memberPhoto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHB0qSwHRdl9y1alzNQ7Ln9bUWTUyGnGe0I8d1A8UMbuOfBqgjDYv-Xt7LfgB-X8xFk0VHCuQEW9E-AkYKZRZrPU0lyrXXW1hFjk217AtGWYI4VsPvIE-FA3-dX6Tzq04ogz5PvsW9NfZxSyzrHvgtjVmcfxK1W4PQgD00N6SdCAMaUKdL7kdGCGcX1wbUX0fIXy4Y7zP4ZdhLNMa7-Xxdz9mIP45aZr8_UIxiNcdxsJHi8cbyn3IBID8eTfRwG1el_hllWxJhZJI', planName: 'Elite Plan', timestamp: '09:42 AM', status: 'SUCCESS' },
  { id: 'att2', memberId: 'm4', memberName: 'Elena Vance', memberPhoto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7za0oHy_8qnfWxuITY5ct_rn5tyGLO70vC-Uk6uSRXZjQ4QV5xmcds_ukO2KyrWNonwXVfumQHYwaGdEynO13ErXOzxg1ozyY2MMPzfOyv6jLl7B_nYClrhElViYJBMT5f2jIInqk7X1zLD78TfZCf84drdxhD4cMVkh0uG3kglj-wmFygWICpUx21dhIIJxEqpF0_uL2NHSY6n0RNJuzzO5Wxg3dOMd8RaIm84DohBOV2K1J8_k4snglj430CrAkOhSnx7hvUFo', planName: 'Basic Plan', timestamp: '09:15 AM', status: 'SUCCESS' },
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Membership Expiry Warning', message: 'Jordan Smith\'s Elite Plan expires in 2 days.', timestamp: '2026-06-22T08:00:00Z', type: 'expiry' },
  { id: 'n2', title: 'Payment Due', message: 'Mike Ross\'s Protein Pack payment is pending capture.', timestamp: '2026-06-21T18:30:00Z', type: 'payment' },
  { id: 'n3', title: 'Announcing Workout System Update', message: 'New responsive attendance tracking maps are now online for everyone!', timestamp: '2026-06-20T10:00:00Z', type: 'announcement' },
];
