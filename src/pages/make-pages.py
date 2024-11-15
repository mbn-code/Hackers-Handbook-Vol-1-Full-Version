import os

# List of categories
categories = [
    'Apt Package Manager',
    'Firewall',
    'VPN',
    'Root Access',
    'SQL Injection',
    'Malware',
    'Trojan',
    'Encryption',
    'Decryption',
    'Brute Force Attack',
    'Phishing Attack',
    'SSL Certificate',
    'Two-Factor Authentication (2FA)',
    'Rootkit',
    'Port Scanning',
    'Backdoor',
    'Vulnerability',
    'Proxy Server',
    'Packet Sniffing',
    'DDoS Attack',
    'Zero-Day Exploit'
]

# Directory where Markdown files will be created
pages_directory = 'src/pages/en/'

# Create the Markdown files
for category in categories:
    page_filename = f'{pages_directory}page-{category.lower().replace(" ", "-")}.md'
    if not os.path.exists(page_filename):
        with open(page_filename, 'w') as f:
            f.write('---\n')
            f.write(f'title: {category}\n')
            f.write(f'description: Description for {category}\n')
            f.write(f'layout: ../../layouts/MainLayout.astro\n')
            f.write('---\n\n')
            f.write(f'# {category}\n\n')
            f.write(f'<!-- Content for {category} page -->\n')

print('Markdown files created in the "en" folder.')
