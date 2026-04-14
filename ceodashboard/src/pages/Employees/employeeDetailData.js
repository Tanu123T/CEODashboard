/**
 * Employee Detail Data
 * Mock data for detailed employee information
 */

export const getEmployeeDetailData = (employee) => {
  // Generate data based on employee ID seed for consistency
  const seed = employee ? Number(employee.id.split('-')[1] || 1) : 1;
  
  return {
    email: `em.${employee?.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    phone: `+${100 + seed}-${400 + seed}-${7000 + seed * 100}`,
    location: employee?.location || 'New York, USA',
    experience: `${2.5 + (seed % 5)}.5 Years`,
    kpiScore: Math.max(80, Math.min(100, 85 + (seed % 16))),
    
    skills: ['JavaScript', 'React', 'Node.js', 'Agile', 'TypeScript', 'Python'].slice(0, 4 + (seed % 2)),
    
    projects: [
      {
        name: 'Employee Management System',
        status: 'In Progress',
        techStack: ['JavaScript', 'React', 'Node.js'],
        links: {
          github: false,
          demo: seed % 2 === 0
        }
      },
      {
        name: 'E-Commerce Platform',
        status: 'Completed',
        techStack: ['JavaScript', 'React', 'Node.js'],
        links: {
          github: false,
          demo: seed % 3 === 0
        }
      },
      {
        name: 'Internal Chat Application',
        status: 'Completed',
        techStack: ['JavaScript', 'React', 'Node.js'],
        links: {
          github: false,
          demo: false
        }
      }
    ],
    
    insights: {
      strengths: [
        'Problem Solving',
        'Leadership',
        'Communication',
        'Technical Expertise',
        'Teamwork'
      ].slice(0, 3 + (seed % 2)),
      weaknesses: [
        'Time Management',
        'Delegation',
        'Public Speaking'
      ].slice(0, 1 + (seed % 2)),
      summary: `${employee?.name || 'This'} is an exceptional technical professional with strong mentoring capabilities. Demonstrates consistent delivery and proactive problem-solving. Shows great potential for senior management role.`
    },
    
    goals: [
      {
        text: 'Complete advanced project management certification',
        deadline: 'June 30, 2026',
        completed: seed % 3 === 0
      },
      {
        text: 'Mentor 3 junior developers',
        deadline: 'December 31, 2026',
        completed: false
      },
      {
        text: 'Lead architecture redesign project',
        deadline: 'August 31, 2026',
        completed: seed % 2 === 0
      },
      {
        text: 'Improve team productivity by 25%',
        deadline: 'September 30, 2026',
        completed: false
      }
    ],
    
    education: [
      {
        degree: 'B.Sc. In Computer Science',
        institution: 'State University',
        year: `${2010 + (seed % 6)} – ${2013 + (seed % 6)}`,
        gpa: `${3.5 + (seed % 5) * 0.1}`
      },
      {
        degree: 'M.Sc. In Software Engineering',
        institution: 'Tech University',
        year: `${2014 + (seed % 6)} – ${2016 + (seed % 6)}`,
        gpa: `${3.7 + (seed % 4) * 0.1}`
      }
    ],
    
    achievements: [
      {
        title: 'Best Employee of the Year ' + (2024 - (seed % 3)),
        year: 2024 - (seed % 3),
        type: 'award'
      },
      {
        title: 'Certified ScrumMaster (CSM)',
        year: 2020 + (seed % 3),
        type: 'certification'
      },
      {
        title: `${employee?.name || 'Employee'}'s ID Proof (PDF)`,
        year: 2024,
        type: 'document'
      }
    ],
    
    documents: [
      {
        name: 'Resume',
        size: `${10 + (seed % 5)} MB`,
        type: 'PDF'
      },
      {
        name: 'Completed the React Certification',
        size: `${5 + (seed % 3)}.00 kB`,
        type: 'PDF'
      }
    ],
    
    managerFeedback: {
      comment: `${employee?.name} is an outstanding team member who consistently delivers high-quality work. Their technical expertise combined with collaborative approach makes them invaluable to the team. Strong candidate for leadership role.`,
      author: 'Sarah Manager',
      rating: Math.max(3, Math.min(5, 4 + (seed % 2)))
    }
  };
};
