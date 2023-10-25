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
  { text: 'Apt Package Manager', link: 'en/page-apt', description: 'A package manager commonly used in Debian-based Linux distributions for installing, updating, and managing software packages.' },
  { text: 'Firewall', link: 'en/page-firewall', description: 'A security system that monitors and controls incoming and outgoing network traffic to prevent unauthorized access and protect against cyber threats.' },
  { text: 'VPN', link: 'en/page-vpn', description: 'A Virtual Private Network that creates a secure and encrypted connection over a less secure network, such as the internet, to ensure privacy and security.' },
  { text: 'Root Access', link: 'en/page-root-access', description: 'Full administrative access to a system or device, often required for certain advanced tasks and potentially risky if not managed carefully.' },
  { text: 'SQL Injection', link: 'en/page-sql-injection', description: 'A hacking technique where an attacker injects malicious SQL queries into input fields to manipulate a database and potentially gain unauthorized access.' },
  { text: 'Malware', link: 'en/page-malware', description: 'Malicious software designed to harm or gain unauthorized access to a computer system, often including viruses, spyware, and ransomware.' },
  { text: 'Trojan', link: 'en/page-trojan', description: 'A type of malware that disguises itself as legitimate software but contains malicious code that can harm or compromise a system.' },
  { text: 'Encryption', link: 'en/page-encryption', description: 'The process of converting data into a code to prevent unauthorized access, providing data security and confidentiality.' },
  { text: 'Decryption', link: 'en/page-decryption', description: 'The process of converting encrypted data back into its original form, allowing authorized users to access the information.' },
  { text: 'Brute Force Attack', link: 'en/page-brute-force-attack', description: 'A trial-and-error method of guessing a password or encryption key by systematically trying all possible combinations until the correct one is found.' },
  { text: 'Phishing Attack', link: 'en/page-phishing-attack', description: 'A fraudulent attempt to obtain sensitive information, such as login credentials and credit card details, by posing as a trustworthy entity in electronic communication.' },
  { text: 'SSL Certificate', link: 'en/page-ssl-certificate', description: 'A digital certificate that authenticates the identity of a website and encrypts data transmitted between the users browser and the web server.' },
  { text: 'Two-Factor Authentication (2FA)', link: 'en/page-2fa', description: 'An extra layer of security that requires users to provide two different authentication factors, typically something they know (password) and something they have (a mobile device or hardware token).' },
  { text: 'Rootkit', link: 'en/page-rootkit', description: 'A collection of malicious software that provides unauthorized access and control over a computer or network while hiding its presence from users and security software.' },
  { text: 'Port Scanning', link: 'en/page-port-scanning', description: 'The process of scanning a computer or network to identify open network ports and services, often used by attackers to find potential vulnerabilities.' },
  { text: 'Backdoor', link: 'en/page-backdoor', description: 'A hidden or undocumented means of accessing a computer system or network, often created for legitimate purposes but sometimes exploited by attackers.' },
  { text: 'Vulnerability', link: 'en/page-vulnerability', description: 'A weakness in a systems security that can be exploited by attackers to compromise the integrity, availability, or confidentiality of the system.' },
  { text: 'Proxy Server', link: 'en/page-proxy-server', description: 'An intermediary server that acts as a gateway between a users computer and the internet, providing anonymity, security, and access control.' },
  { text: 'Packet Sniffing', link: 'en/page-packet-sniffing', description: 'The practice of intercepting and inspecting data packets as they travel over a network to capture information, often used for network troubleshooting but can be misused for unauthorized surveillance.' },
  { text: 'DDoS Attack', link: 'en/page-ddos-attack', description: 'A Distributed Denial of Service attack that overwhelms a network or website with a flood of traffic, rendering it unavailable to users.' },
  { text: 'Zero-Day Exploit', link: 'en/page-zero-day-exploit', description: 'A cyberattack that targets a software vulnerability that is unknown to the software vendor or lacks a patch, making it particularly dangerous.' },
	],
	}
  };
  