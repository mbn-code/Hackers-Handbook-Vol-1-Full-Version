export const SITE = {
	title: 'Hackers Handbook Vol. 1',
	description: 'This website / documentation / Tutorial is about teaching beginners or more advanced hackers how to use different tools.\n As this is a handbook, you can also use this as a cheat sheet.',
	defaultLanguage: 'en_US',
  };
  
  export const OPEN_GRAPH = {
	image: {
	  src: 'https://github.com/withastro/astro/blob/main/assets/social/banner.jpg?raw=true',
	  alt:
		'astro logo on a starry expanse of space,' +
		' with a purple Saturn-like planet floating in the right foreground',
	},
	twitter: 'astrodotbuild',
  };
  
  // This is the type of the frontmatter you put in the docs markdown files.
  export type Frontmatter = {
	title: string;
	description: string;
	layout: string;
	image?: { src: string; alt: string };
	dir?: 'ltr' | 'rtl';
	ogLocale?: string;
	lang?: string;
  };
  
  export const KNOWN_LANGUAGES = {
	English: 'en',
  } as const;
  export const KNOWN_LANGUAGE_CODES = Object.values(KNOWN_LANGUAGES);
  
  export const GITHUB_EDIT_URL = `https://github.com/withastro/astro/tree/main/examples/docs`;
  
  export const COMMUNITY_INVITE_URL = `https://discord.gg/eEYyhQqHJv`;
  
  // See "Algolia" section of the README for more information.
  export const ALGOLIA = {
	indexName: 'XXXXXXXXXX',
	appId: 'XXXXXXXXXX',
	apiKey: 'XXXXXXXXXX',
  };
  
  export type Sidebar = Record<
	typeof KNOWN_LANGUAGE_CODES[number],
	Record<string, { text: string; link: string }[]>
  >;
  export const SIDEBAR = {
	en: {
	  // Introduction and Basics
	  'Introduction': [
		{ text: 'Introduction', link: 'en/introduction' },
		{ text: 'Where to Start Hacking?', link: 'en/where-to-start' },
	  ],
  
	  // Fundamentals
	  'Fundamentals': [
		{ text: 'Computer Hardware', link: 'en/page-hardware' },
		{ text: 'Operating Systems', link: 'en/page-2' },
		{ text: 'Virtual Machines', link: 'en/page-3' },
		{ text: 'Networking', link: 'en/page-networking' },
		{ text: 'IP Address', link: 'en/page-ip' },
		{ text: 'Host', link: 'en/page-host' },
	  ],
  
	  // Hacking Tools and Techniques
	  'Hacking Tools and Techniques': [
		{ text: 'Nmap', link: 'en/page-4' },
		{ text: 'Phishing', link: 'en/page-5' },
		{ text: 'Metasploit', link: 'en/page-6' },
		{ text: 'Metasploitable VM Setup', link: 'en/page-metasploitable' },
		{ text: 'Metasploit Video Example', link: 'en/page-metasploitVideoExample' },
		{ text: 'Social Engineering', link: 'en/page-socialEngineering' },
		{ text: 'Bash Scripting in Hacking', link: 'en/page-bash' },
		{ text: 'Python in Hacking', link: 'en/page-7' },
	  ],
  
	  // Advanced Topics
	  'Advanced Topics': [
		{ text: 'Cryptography', link: 'en/page-cryptography' },
		{ text: 'Web Hacking', link: 'en/page-web-hacking' },
		{ text: 'Wireless Hacking', link: 'en/page-wireless-hacking' },
		{ text: 'Ethical Hacking Methodologies', link: 'en/page-ethical-hacking' },
		{ text: 'Exploitation Frameworks', link: 'en/page-exploitation-frameworks' },
		{ text: 'Linux and Shell Scripting', link: 'en/page-linux-shell' },
		{ text: 'Operating Systems Security', link: 'en/page-os-security' },
		{ text: 'Legal and Ethical Considerations', link: 'en/page-legal-ethical' },
		{ text: 'Anonymity and Privacy', link: 'en/page-anonymity-privacy' },
		{ text: 'Malware and Malware Analysis', link: 'en/page-malware-analysis' },
		{ text: 'Incident Response', link: 'en/page-incident-response' },
		{ text: 'Capture The Flag (CTF) Challenges', link: 'en/page-ctf-challenges' },
		{ text: 'Real-World Case Studies', link: 'en/page-case-studies' },
		{ text: 'Forensics', link: 'en/page-forensics' },
		{ text: 'Wireless and IoT Hacking', link: 'en/page-wireless-iot' },
		{ text: 'Cloud Security', link: 'en/page-cloud-security' },
		{ text: 'Red Team and Blue Team Concepts', link: 'en/page-red-blue-teams' },
		{ text: 'Secure Coding', link: 'en/page-secure-coding' },
		{ text: 'Secure Password Management', link: 'en/page-secure-passwords' },
		{ text: 'Update and Stay Current', link: 'en/page-stay-current' },
	  ],
  
	  // Additional References
	  'Words and Answers': [
		{ text: 'Apt Package Manager', link: 'en/page-apt' },
	  ],
	}
  };
  