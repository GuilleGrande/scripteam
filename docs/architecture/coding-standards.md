# Coding Standards

This document defines the coding standards and best practices for the ScripTeam POC project, focused on JavaScript, TypeScript, React Native, and Expo development.

## Code Style and Structure

### Clean, Readable Code
- **Descriptive Naming**: Use clear, descriptive names for variables and functions that explain their purpose
- **Single Responsibility**: Each function and component should have one clear purpose
- **Consistent Formatting**: Use Prettier for automatic code formatting
- **Meaningful Comments**: Add comments for complex business logic, but prefer self-documenting code

### Component Architecture
- **Functional Components**: Use functional components with hooks (useState, useEffect, etc.) over class components
- **Component Modularity**: Break down components into smaller, reusable pieces
- **Custom Hooks**: Extract reusable logic into custom hooks
- **Component Composition**: Prefer composition over inheritance

### File Organization
- **Feature-Based Structure**: Group related components, hooks, and styles into feature-based directories
- **Clear Separation**: Separate business logic, UI components, and data management
- **Index Files**: Use index.js/ts files for clean imports

## Naming Conventions

### Variables and Functions
- **camelCase**: Use camelCase for variables and functions
  ```typescript
  const isFetchingData = true;
  const handleUserInput = () => {};
  ```

### Components
- **PascalCase**: Use PascalCase for component names
  ```typescript
  const UserProfile = () => {};
  const ChatScreen = () => {};
  ```

### Directories and Files
- **kebab-case**: Use lowercase and hyphenated names for directories
  ```
  /src/components/user-profile/
  /src/screens/chat-screen/
  ```
- **PascalCase**: Use PascalCase for component files
  ```
  UserProfile.tsx
  ChatScreen.tsx
  ```

### Constants
- **SCREAMING_SNAKE_CASE**: Use for constants
  ```typescript
  const API_BASE_URL = 'https://api.example.com';
  const MAX_RETRY_ATTEMPTS = 3;
  ```

## TypeScript Usage

### Type Definitions
- **Interfaces**: Use interfaces for object shapes
  ```typescript
  interface User {
    id: string;
    name: string;
    email: string;
  }
  ```

### Type Safety
- **Strict Mode**: Enable strict TypeScript compilation
- **Explicit Types**: Be explicit with types, avoid `any`
- **Generic Types**: Use generics for reusable components
- **Utility Types**: Leverage TypeScript utility types (Pick, Omit, Partial, etc.)

## JavaScript/TypeScript Best Practices

### Modern JavaScript Features
- **Arrow Functions**: Use arrow functions for concise syntax
  ```typescript
  const handleClick = (id: string) => {};
  ```
- **Destructuring**: Use destructuring for cleaner code
  ```typescript
  const { name, email } = user;
  const [first, ...rest] = items;
  ```
- **Template Literals**: Use template literals for string interpolation
  ```typescript
  const message = `Hello, ${user.name}!`;
  ```
- **Optional Chaining**: Use optional chaining for safe property access
  ```typescript
  const city = user?.address?.city;
  ```

### Variable Declaration
- **const/let**: Use `const` by default, `let` when reassignment is needed
- **No var**: Avoid `var` declarations
- **Minimize Global Variables**: Avoid global variables to prevent side effects

## React Native Specific Guidelines

### Performance Optimization

#### State Management
- **Local State**: Use local state only when needed
- **State Optimization**: Avoid unnecessary state updates
- **Zustand**: Use Zustand for global state management as specified in tech stack

#### Memoization
- **React.memo()**: Use for functional components to prevent unnecessary re-renders
  ```typescript
  const MemoizedComponent = React.memo(({ data }) => {
    return <View>{data.title}</View>;
  });
  ```
- **useMemo/useCallback**: Use for expensive calculations and stable references
  ```typescript
  const expensiveValue = useMemo(() => calculateExpensiveValue(data), [data]);
  const stableHandler = useCallback((id: string) => handleAction(id), []);
  ```

#### FlatList Optimization
- **Performance Props**: Use optimization props for large lists
  ```typescript
  <FlatList
    data={items}
    renderItem={renderItem}
    removeClippedSubviews={true}
    maxToRenderPerBatch={10}
    windowSize={10}
    getItemLayout={getItemLayout} // if item height is fixed
  />
  ```
- **Stable renderItem**: Avoid anonymous functions in renderItem
  ```typescript
  const renderItem = useCallback(({ item }) => <ItemComponent item={item} />, []);
  ```

### UI and Styling

#### Styling Approach
- **StyleSheet.create()**: Use for static styles
  ```typescript
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
  });
  ```
- **NativeBase**: Use NativeBase components as specified in tech stack
- **Responsive Design**: Ensure designs adapt to various screen sizes

#### Image Handling
- **Optimized Images**: Use appropriate image formats and sizes
- **Loading States**: Implement loading states for images
- **Error Handling**: Handle image loading errors gracefully

### Navigation
- **Expo Router**: Use Expo Router for file-based routing
- **Type-Safe Navigation**: Use typed navigation parameters
- **Deep Linking**: Implement proper deep linking support

## Testing Standards

### Unit Testing
- **Jest**: Use Jest for unit testing as specified in tech stack
- **React Native Testing Library**: Use for component testing
- **Test Coverage**: Maintain minimum 80% test coverage
- **Test Naming**: Use descriptive test names that explain the scenario

### E2E Testing
- **Detox**: Use Detox for end-to-end testing as specified in tech stack
- **User Flows**: Test critical user flows
- **Real Device Testing**: Test on real devices when possible

## Error Handling

### Error Boundaries
- **React Error Boundaries**: Implement error boundaries for component trees
- **Graceful Degradation**: Provide fallback UI for errors

### API Error Handling
- **Consistent Error Responses**: Handle API errors consistently
- **User-Friendly Messages**: Show user-friendly error messages
- **Retry Logic**: Implement retry logic for transient failures

## Security Best Practices

### Data Protection
- **Input Validation**: Validate all user inputs
- **Secure Storage**: Use secure storage for sensitive data
- **No Hardcoded Secrets**: Never hardcode API keys or secrets

### Authentication
- **Auth0**: Use Auth0 as specified in tech stack
- **Token Management**: Handle tokens securely
- **Session Management**: Implement proper session timeout

## Code Review Guidelines

### Review Checklist
- **Functionality**: Code works as intended
- **Performance**: No obvious performance issues
- **Security**: No security vulnerabilities
- **Maintainability**: Code is easy to understand and modify
- **Testing**: Adequate test coverage
- **Standards Compliance**: Follows these coding standards

### Review Process
- **Small PRs**: Keep pull requests small and focused
- **Clear Descriptions**: Provide clear PR descriptions
- **Automated Checks**: Ensure all automated checks pass
- **Constructive Feedback**: Provide constructive, actionable feedback

## Tools and Automation

### Development Tools
- **ESLint**: Use for code linting
- **Prettier**: Use for code formatting
- **TypeScript**: Use strict mode
- **Expo CLI**: Use for development and building

### CI/CD
- **GitHub Actions**: Use as specified in tech stack
- **Automated Testing**: Run tests on every PR
- **Automated Deployment**: Use EAS Build for deployments

## Documentation

### Code Documentation
- **README Files**: Maintain clear README files
- **API Documentation**: Document API endpoints
- **Component Documentation**: Document component props and usage
- **Architecture Decisions**: Document significant architectural decisions

### Comments
- **Why, Not What**: Explain why something is done, not what is done
- **Complex Logic**: Comment complex business logic
- **TODO Comments**: Use TODO comments sparingly and track them