# CONTEXT

## Glossary

### Tech Stack
The set of frameworks, languages, and platforms Bradley personally explores outside of work. Displayed on the about page as an icon-link grid. Each entry links to the technology's homepage. Distinct from the website's own implementation stack (SvelteKit, Tailwind, Bits UI).

### Project Stack
The set of technologies a single portfolio project was built with. Listed alongside that project on the portfolio page. An entry usually names a product with a canonical home page, but may name a general technique or concept that has no single authoritative link. Distinct from Tech Stack, which describes Bradley's own interests rather than any one project's implementation.

### Learning Source
A person, platform, or company Bradley has learned from outside of work. Listed in the Extracurricular section of the about page. The unit is the source itself rather than any individual course. A person and the platform they created count as one source, not two. Each source carries the subjects it taught.

### Reportable Error
An unexpected failure that indicates a real defect in the website or its integrations, and therefore should create an error-tracking event.

### Route Miss
A request for a path the website does not serve. A route miss is expected HTTP behaviour and is not a reportable error.

### Probe Request
A route miss whose path resembles automated scanner or bot behaviour, such as requests for PHP files or other common exploit targets. A probe request is a special case of route miss and is not a reportable error.

### Expected HTTP Error
An intentional HTTP error response that represents normal application behaviour rather than a defect. Expected HTTP errors are not reportable errors.
