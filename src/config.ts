export const SITE = {
	title: 'Hackers Handbook Vol. 1',
	description: 'This website / documentation / Tutorial is about teaching beginners or more advandes hackers how to use different tools.\n As this is a handbook you can also use this as a cheat sheet.',
	defaultLanguage: 'en_US',
};

export const OPEN_GRAPH = {
	image: {
		src: 'https://github.com/withastro/astro/blob/main/assets/social/banner.jpg?raw=true',
		alt:
			'astro logo on a starry expanse of space,' +
			' with a purple saturn-like planet floating in the right foreground',
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
export const SIDEBAR: Sidebar = {
	en: {
		'Sections': [
			{ text: 'Introduction', link: 'en/introduction' },
			{ text: 'Operating systems', link: 'en/page-2' },
			{ text: 'Virtual machiens', link: 'en/page-3' },
			{ text: "Nmap", link: "en/page-4"},
			{ text: 'Phishing', link: 'en/page-5'},
			{ text: 'Metasploit', link: 'en/page-6'},
		],
		'Sub-subjects': [
			{ text: 'About me', link: 'en/page-about' },
		],
		'Words and answers' : [
			{ text: "Computer Hardware", link: "en/page-hardware"},
			{ text: "IP Address", link: "en/page-ip"},
			{ text: "Host", link: "en/page-host"},
			{ text: "localhost", link: "en/page-localhost" },
			{ text: "Apt package Maneger", link: "en/page-apt"},
			
		],

	},
};
