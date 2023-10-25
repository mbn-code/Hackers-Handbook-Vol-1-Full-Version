import os

# List of page names
pages = [
    'cryptography',
    'networking',
    'web-hacking',
    'wireless-hacking',
    'ethical-hacking',
    'exploitation-frameworks',
    'linux-shell',
    'os-security',
    'legal-ethical',
    'anonymity-privacy',
    'malware-analysis',
    'incident-response',
    'ctf-challenges',
    'case-studies',
    'forensics',
    'wireless-iot',
    'cloud-security',
    'red-blue-teams',
    'secure-coding',
    'secure-passwords',
    'stay-current'
]

# Directory where Markdown files will be created
pages_directory = ''

# Create the Markdown files
for page in pages:
    page_filename = f'{pages_directory}page-{page}.md'
    if not os.path.exists(page_filename):
        with open(page_filename, 'w') as f:
            f.write(f'# {page.replace("-", " ").title()}\n\n<!-- Content for {page} page -->\n')

print('Markdown files created in the "en" folder.')
