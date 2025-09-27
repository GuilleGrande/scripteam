# Level 1: System Context Diagram

## Overview

The System Context diagram shows ScripTeam as a single box in the center, surrounded by its users and the other systems it interacts with. This provides the big picture view that's accessible to all stakeholders.

## PlantUML Source

```plantuml
@startuml ScripTeam-Context
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml

LAYOUT_WITH_LEGEND()

title System Context Diagram for ScripTeam

Person(student, "Acting Student", "Students practicing scripts for theatre classes, auditions, or personal development")
Person(teacher, "Drama Teacher", "Educators using ScripTeam to assign practice materials and track student progress")
Person(actor, "Professional Actor", "Working actors using ScripTeam for script familiarization and character development")

System(scripteam, "ScripTeam", "AI-powered acting practice platform with Spanish/English language support for script analysis, character voice synthesis, and interactive practice sessions")

System_Ext(elevenlabs, "ElevenLabs", "Primary AI voice synthesis service providing high-quality character voices")
System_Ext(playht, "Play.HT", "Backup AI voice synthesis service for redundancy and cost optimization")
System_Ext(openai, "OpenAI GPT", "AI service for character analysis, personality detection, and script understanding")
System_Ext(auth0, "Auth0", "Authentication and user management service (planned)")
System_Ext(google, "Google OAuth", "Social authentication provider for easy user onboarding")
System_Ext(apple, "Apple Sign-In", "iOS authentication integration for mobile users")

System_Ext(cdn, "Content Delivery Network", "Global distribution of audio files and static assets")
System_Ext(monitoring, "Monitoring & Analytics", "Application performance monitoring and user analytics")
System_Ext(email, "Email Service", "Transactional emails for notifications and account management")

Rel(student, scripteam, "Uploads scripts, practices with AI voices, receives performance feedback")
Rel(teacher, scripteam, "Assigns practice materials, monitors student progress, manages classroom accounts")
Rel(actor, scripteam, "Prepares for auditions, develops character understanding, practices delivery")

Rel(scripteam, elevenlabs, "Generates high-quality character voices using AI")
Rel(scripteam, playht, "Fallback voice generation and cost-effective alternatives")
Rel(scripteam, openai, "Analyzes scripts for character detection and personality profiling")

Rel(scripteam, auth0, "Authenticates users and manages account security", "HTTPS")
Rel(scripteam, google, "Enables Google account sign-in for users")
Rel(scripteam, apple, "Provides Apple ID authentication for iOS users")

Rel(scripteam, cdn, "Serves audio files and static content globally")
Rel(scripteam, monitoring, "Sends performance metrics and error tracking data")
Rel(scripteam, email, "Sends practice reminders and progress notifications")

@enduml
```

## Stakeholder Analysis

### Primary Users

#### Acting Students
**Demographics**: Ages 16-25, theatre majors, high school drama students
**Goals**:
- Practice scripts efficiently without needing human partners
- Improve pronunciation and delivery timing
- Build confidence before live performances
**Key Interactions**:
- Upload scripts from classes or auditions
- Practice scenes with AI character voices
- Review performance feedback and improvement suggestions

#### Drama Teachers
**Demographics**: High school and college educators, ages 28-55
**Goals**:
- Assign meaningful practice homework to students
- Track student progress and engagement
- Enhance classroom learning with technology
**Key Interactions**:
- Set up student accounts and assign scripts
- Monitor student practice sessions and progress
- Use platform insights to guide classroom instruction

#### Professional Actors
**Demographics**: Working actors, ages 22-45, audition preparation focus
**Goals**:
- Quickly familiarize with new scripts
- Develop character understanding efficiently
- Practice delivery without scheduling rehearsal partners
**Key Interactions**:
- Upload audition scripts for rapid preparation
- Use character analysis for role development
- Practice timing and emotional delivery

### External Service Dependencies

#### AI Voice Services
**ElevenLabs**: Premium voice synthesis with 75ms latency target
- Provides highest quality character voices
- Primary service for paying users
- Advanced emotional expression capabilities

**Play.HT**: Cost-effective backup with 143ms latency
- Fallback when ElevenLabs is unavailable
- Budget-friendly option for free tier users
- Good quality for basic practice needs

#### AI Analysis Services
**OpenAI GPT**: Character analysis and script understanding
- Detects character personalities and relationships
- Analyzes emotional arcs and scene dynamics
- Provides context for voice parameter selection

#### Authentication Services
**Auth0**: Enterprise-grade authentication (planned)
- Secure user account management
- Integration with educational institution systems
- Advanced security features for institutional users

**Google/Apple OAuth**: Social authentication
- Simplified user onboarding
- Reduced barrier to entry for new users
- Familiar authentication experience

#### Infrastructure Services
**CDN**: Global content distribution
- Fast audio file delivery worldwide
- Reduced latency for voice playback
- Offline capability through caching

**Monitoring**: Application observability
- Performance tracking and optimization
- Error detection and alerting
- User behavior analytics for product improvement

## Business Context

### Value Proposition
ScripTeam transforms script practice from a social activity requiring multiple people into an individual activity that can be done anywhere, anytime. The AI provides consistent, patient practice partners with authentic character voices.

### Market Position
- **Primary Market**: Educational technology for theatre and drama programs
- **Secondary Market**: Professional actor training and audition preparation
- **Unique Differentiator**: AI character voice synthesis specifically for acting practice

### Revenue Model
- **Freemium**: Basic features with limited usage for students
- **Premium Individual**: Unlimited usage with high-quality voices
- **Institutional**: Bulk licensing for schools and theatre programs
- **Professional**: Advanced features for working actors and coaches

## Technical Context

### Integration Complexity
- **High Complexity**: AI service integration requires sophisticated error handling and fallbacks
- **Medium Complexity**: Authentication services need careful security implementation
- **Low Complexity**: CDN and monitoring services use standard integration patterns

### Data Flow Characteristics
- **Upload-Heavy**: Large script files require efficient processing
- **Audio-Intensive**: Generated voice files need global distribution
- **Real-Time**: Practice sessions require low-latency AI responses

### Scalability Considerations
- **User Growth**: System must scale from hundreds to thousands of concurrent users
- **Content Growth**: Audio file storage grows significantly with user adoption
- **AI Usage**: External service costs scale directly with user engagement

## Security and Privacy

### Data Classification
- **High Sensitivity**: User audio recordings and performance data
- **Medium Sensitivity**: Uploaded scripts (may be copyrighted material)
- **Low Sensitivity**: Generated AI voices and system metrics

### Compliance Requirements
- **Educational Privacy**: FERPA compliance for student data
- **International Privacy**: GDPR compliance for European users
- **Content Rights**: Respect for copyrighted script materials

### Security Boundaries
- **User Authentication**: Secure access to personal practice data
- **API Security**: Protected access to AI services and user data
- **Content Protection**: Secure storage and transmission of audio files

## Future Evolution

### Planned Expansions
- **Mobile Applications**: Native iOS and Android apps for practice on-the-go
- **VR Integration**: Immersive practice environments with spatial audio
- **Advanced AI**: Real-time coaching and improvisation support

### Potential Integrations
- **Learning Management Systems**: Canvas, Blackboard integration for schools
- **Video Conferencing**: Zoom, Teams integration for remote classes
- **Content Libraries**: Integration with script databases and publishers

### Scalability Roadmap
- **Phase 1**: Single-region deployment for North American users
- **Phase 2**: Multi-region expansion for global user base
- **Phase 3**: Edge computing for ultra-low latency practice sessions

---

*This context diagram serves as the foundation for all detailed architecture discussions, ensuring all stakeholders understand ScripTeam's role in the broader ecosystem of educational technology and AI services.*