# Developers' Hub (CRM) - Connect, Relate, Meet

## How is CRM Relevant to a Developer?

1. **Networking**: As a developer, you interact with numerous people –
   be they colleagues, potential employers, freelancers, or clients. A
   CRM can help keep track of these contacts, ensuring you never lose
   touch.

2. **Project Tracking**: If you're freelancing or running a software
   business, a CRM can help manage your leads and clients, keeping
   track of project statuses, payment schedules, and more.

3. **Knowledge Sharing**: A CRM can help track whom you've shared
   particular resources or information with, ensuring you never repeat
   or forget to share essential materials.

4. **Mentorship & Learning**: If you're a mentor or looking for
   mentorship, a CRM can help track mentees, their progress, topics
   covered, and more. If you attend workshops, webinars, or online
   courses, you can note down who you met, what you learned, and any
   follow-up actions.

5. **Job Opportunities**: Use the CRM to track job offers, interviews,
   and related interactions.

6. **Personal Branding & Content**: If you're into blogging,
   podcasting, or any form of content creation, a CRM can help manage
   your audience, collaborations, and feedback.

7. **Reminders**: Set reminders for follow-ups, sending out
   portfolios, checking in on old clients, or even just catching up
   with developer friends.

## Data Modeling and Schema:

The application will focus on two main things:

1. Reminding users to maintain contact with important people.
2. Being easy to update and maintain.

The data model reflects this focus, aiming to reduce friction and make
the application genuinely useful.

### Tables:

1. **Contacts Table**:

   - `contact_id` (INTEGER, PRIMARY KEY, AUTOINCREMENT)
   - `name` (TEXT)
   - `relationship` (TEXT)
   - `birthday` (DATE)
   - `industry` (TEXT)
   - `location` (TEXT)
   - `vip` (BOOLEAN)
   - `last_update` (TEXT)
   - `last_contacted` (DATE)
   - `status` (TEXT)

2. **Interactions Table**:

   - `interaction_id` (INTEGER, PRIMARY KEY, AUTOINCREMENT)
   - `contact_id` (INTEGER, FOREIGN KEY)
   - `type` (TEXT)
   - `date` (DATE)
   - `notes` (TEXT)

3. **Background Table** (For VIPs):

   - `background_id` (INTEGER, PRIMARY KEY, AUTOINCREMENT)
   - `contact_id` (INTEGER, FOREIGN KEY)
   - `family` (TEXT)
   - `company` (TEXT)
   - `likes_dislikes` (TEXT)
   - `misc_notes` (TEXT)

4. **ContactInfo Table** (For VIPs):
   - `contact_info_id` (INTEGER, PRIMARY KEY, AUTOINCREMENT)
   - `contact_id` (INTEGER, FOREIGN KEY)
   - `main_app` (TEXT)
   - `email` (TEXT)
   - `phone_number` (TEXT)
   - `social_links` (TEXT)

### Relationships:

- **Contacts and Interactions**:

  - One-to-Many relationship. Each contact can have multiple
    interactions.

- **Contacts and Background**:

  - One-to-One relationship. Each VIP contact has one background
    entry.

- **Contacts and ContactInfo**:

  - One-to-One relationship. Each VIP contact has one contact_info
    entry.

### Data Flexibility:

- **Relationship Types**: Pre-defined options include "friend",
  "family", "colleague", "school", "network", "services", with the
  flexibility to add more.
- **Industry Types**: Pre-defined options include "technology",
  "entertainment", "finance", "education", with the flexibility to add
  more.
- **Status Timing**: Users can customize the time frame for when a
  contact should be "hit up" versus when they are "all good".

### VIP Features:

- **Snapshot View**: For VIP contacts, additional fields will appear
  in a snapshot view including `last_update`, `last_contacted`, and
  `status`.
- **Additional Sections**: For VIPs, the Background, ContactInfo, and
  Notes tables hold supplementary information.
- **Activation/Deactivation**: VIPs can be toggled on and off.
  Deactivating a VIP will keep the extra information but remove them
  from the snapshot view.

## Tips:

- **Security**: Ensure robust authentication and authorization
  mechanisms.
- **Responsive Design**: Implement a responsive design to cater to
  both desktop and mobile.
- **Backup**: Regularly backup your SQLite database.
