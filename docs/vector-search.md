# Vector Search with sqlite-vec

## Overview

Vector search enables semantic search across your entire relationship
history. Instead of matching exact keywords, it understands meaning
and context.

**Why it matters:** Find "people who work on performance" when they
mentioned "optimization", "speed improvements", or "low-level
programming" - without ever using the word "performance".

## Technical Foundation

### sqlite-vec

**Decision:** Use sqlite-vec for vector storage and similarity search.

Pure C extension for SQLite that adds vector similarity search. No
external services, stays self-hosted, works offline.

- **Repo:**
  [sqlite-vec by Alex Garcia](https://github.com/asg017/sqlite-vec)
- **Version:** 0.1.7-alpha.2 (proven in production)
- **Vector size:** 1024 dimensions (Voyage AI standard)
- **Distance metrics:** Cosine similarity, L2, inner product
- **Query syntax:** KNN with `MATCH` operator, fallback to
  `vec_distance_cosine()`
- **Performance:** Handles millions of vectors efficiently
- **Zero dependencies:** Ships as single C file

### Embedding Model

**Decision:** Use Voyage AI's `voyage-3` for all embeddings.

Proven in production at scottspence.com for semantic search.

**Specs:**

- **Cost:** $0.10 per 1M tokens
- **Dimensions:** 1024 (smaller than OpenAI's 1536)
- **Average text:** 100-200 tokens per embedding
- **Quality:** Superior for semantic search compared to OpenAI

**Why Voyage AI over OpenAI:**

- Better semantic search quality
- Optimized specifically for retrieval tasks
- Smaller dimension size = faster queries
- Proven in production use

### Cost Analysis

**Initial embedding (100 users):**

- 10,000 contacts × 100 tokens = 1M tokens = $0.10
- 100,000 interactions × 100 tokens = 10M tokens = $1.00
- **Total one-time cost: $1.10**

**Ongoing (per month per 100 users):**

- 1,000 new interactions × 100 tokens = 100k tokens = $0.01/month

**Per user cost: ~$0.0001/month** (essentially free)

## Database Schema

```sql
-- Contact embeddings (name + company + bio + notes)
CREATE VIRTUAL TABLE IF NOT EXISTS contact_embeddings USING vec0(
  contact_id TEXT PRIMARY KEY,
  embedding FLOAT[1024]
);

-- Interaction embeddings (note + type + context)
CREATE VIRTUAL TABLE IF NOT EXISTS interaction_embeddings USING vec0(
  interaction_id TEXT PRIMARY KEY,
  embedding FLOAT[1024]
);
```

**Note:** Embeddings stored as JSON strings, sqlite-vec handles
conversion automatically.

## Features Enabled

### 1. Semantic Contact Search (Free Tier)

Search by meaning, not just keywords.

**Query:** "machine learning developers"

**Finds contacts who mentioned:**

- "neural networks"
- "training models"
- "AI research"
- "deep learning"
- "LLM development"

**How it works:**

1. Convert user query to embedding via Voyage AI
2. Use sqlite-vec KNN search to find similar contact embeddings
3. Return top N matches ordered by similarity

**Benefits:**

- No LLM needed (just embeddings)
- Fast (<200ms)
- Understands context and synonyms

### 2. Smart Context for AI (Pro Tier)

Retrieve only relevant context for AI suggestions using vector search
instead of sending entire interaction history.

**Example:** User wants to follow up with Sarah about "API project"

**Process:**

1. Embed the topic ("API project")
2. Find most relevant past interactions via vector similarity
3. Send only top 5 relevant interactions to LLM

**Benefits:**

- Better AI output (more relevant context)
- Lower cost (fewer tokens to LLM)
- Faster (smaller context window)

### 3. Similar Contacts Discovery (Premium Tier)

Find contacts with similar backgrounds, interests, or work.

**Use cases:**

- "Show me people similar to Sarah" → find others in same field
- "Who else should I introduce to this person?"
- "Find more contacts like this"

**How:** Compare contact embeddings using cosine similarity.

### 4. Topic Clustering (Premium Tier)

Analyze what you talk about with each contact.

**Process:**

1. Get all interaction embeddings for contact
2. Cluster embeddings by similarity (k-means or DBSCAN)
3. Use LLM to name clusters based on sample interactions
4. Show breakdown: "React 40%, Career advice 30%, Conferences 20%,
   Personal 10%"

### 5. Connection Graph Visualization (Premium Tier)

Visual network map showing how contacts relate based on similarity.

**Visualization:**

- Nodes = contacts
- Distance = vector similarity (closer = more similar)
- Color = industry/topic cluster
- Size = relationship strength score

**Use cases:**

- See clusters: "React developers", "Conference connections",
  "Potential clients"
- Find connectors: people who bridge multiple clusters
- Discover patterns in your network

**Frontend:** D3.js force-directed graph

## Embedding Pipeline

### When to Embed

**Contacts:**

- On create
- On update (if name, company, bio, or notes changed)

**Interactions:**

- On create
- On update (if note changed)

### What Gets Embedded

**Contact embedding content:**

- Name
- Company
- Title
- GitHub username (if present)
- Notes

**Interaction embedding content:**

- Type (meeting, email, etc.)
- Contact name (for context)
- Note text

### Caching Strategy

- Check if embedding exists before creating new one
- For MVP: Re-embed on every update (cheap enough)
- For production: Track content hash, only re-embed if changed

## Search UX

### Contact Search Page

Add toggle between "Keyword" and "Semantic" search modes.

**Semantic mode:**

- Show helper text: "Searching by meaning (e.g., 'rust developers'
  finds 'systems programming')"
- Display similarity scores in results

### Suggested Topics UI

On follow-up reminder page, show AI-generated discussion topics based
on vector search results.

**Display:**

- "Based on: Past conversations, time since last contact, recent
  activity"
- 3-5 suggested topics
- Auto-shown when >30 days since last contact

## Implementation Phases

### Phase 1: Foundation (Week 1)

- Add sqlite-vec extension to project
- Create embedding tables
- Build embedding pipeline (embed on create/update)

### Phase 2: Basic Search (Week 2)

- Embed existing contacts and interactions (background job)
- Add semantic search option to contacts page
- Show similarity scores in results

### Phase 3: AI Context (Week 3)

- Use vector search for AI features
- Implement "suggested topics" on follow-up page
- Test context relevance improvements

### Phase 4: Advanced Features (Week 4+)

- Similar contacts discovery
- Topic clustering analysis
- Connection graph visualization
- Network insights dashboard

## Testing Approach

### Quality Validation

Periodically audit search quality:

- Sample 10 queries
- Compare keyword vs semantic results
- Validate relevance
- Adjust similarity thresholds if needed

### Performance Monitoring

Monitor:

- Query performance on large datasets (10k+ contacts)
- Memory usage during similarity searches
- Embedding generation time (target: <500ms per item)
- Search query time (target: <200ms)

## Privacy Considerations

**What gets embedded:**

- Contact names, companies, titles, bio, notes
- Interaction notes

**What doesn't:**

- Emails, phone numbers, addresses (PII)
- Sensitive data marked by user

**Embedding provider:** Voyage AI

- Data sent to Voyage AI for embedding generation
- Not used for training (per Voyage AI policy)
- Future option: Switch to local embeddings (ONNX Runtime +
  all-MiniLM-L6-v2)

## Future Enhancements

### Local Embeddings

Replace Voyage AI with local model for privacy:

- Use ONNX Runtime + all-MiniLM-L6-v2 (384 dimensions)
- Zero API costs
- Full data privacy
- Trade-off: Slightly lower quality

### Hybrid Search

Combine keyword + vector search:

- 50% keyword match weight
- 50% semantic similarity weight
- Best of both worlds

### Cross-User Insights (Premium)

Anonymized aggregate insights:

- "Contacts in AI industry typically discuss: [topics]"
- Benchmark relationship health against similar contacts
- Industry-specific suggestions

## Success Metrics

**Adoption:**

- % of users who try semantic search
- Semantic vs keyword search usage ratio
- User feedback on relevance

**Quality:**

- Search result click-through rate
- "Suggested topics" acceptance rate
- Similar contact discovery usage

**Technical:**

- Embedding generation time (target: <500ms per item)
- Search query time (target: <200ms)
- Storage overhead (embeddings are ~6KB per item)

## Resources

- [sqlite-vec Documentation](https://github.com/asg017/sqlite-vec)
- [Voyage AI Embeddings](https://docs.voyageai.com/docs/embeddings)
- [Production example: scottspence.com](https://github.com/spences10/scottspence.com)
  (related posts feature)
- [Vector Search Best Practices](https://www.pinecone.io/learn/vector-search/)
