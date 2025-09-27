# Script Upload Journey

## Journey Overview

**Primary User**: Sofia (Acting Student)
**Goal**: Upload a script file and have it processed for AI analysis
**Duration**: 2-3 minutes (including processing time)
**Complexity**: Low - Entry-level user flow

## Scenario

Sofia has received a new script for her advanced Spanish theatre class. She wants to upload it to ScripTeam so she can practice with AI-generated character voices later. The script is a PDF file she downloaded from her professor's course portal.

## Preconditions

- ✅ User has access to ScripTeam web application
- ✅ User has a script file (PDF or TXT, <10MB)
- ✅ Internet connection is stable
- ✅ Browser supports file upload (modern browser)

## User Journey Steps

### Step 1: Access Upload Interface
**User Action**: Sofia navigates to ScripTeam home page and sees the script upload interface

**System Response**:
- Display upload area with drag-and-drop zone
- Show supported file types (PDF, TXT)
- Display file size limit (10MB max)
- Show upload button and file selection option

**Success Criteria**:
- Upload interface loads within 2 seconds
- Clear instructions are visible
- File restrictions are clearly communicated

**Test Scenarios**:
- ✅ **TC-SU-001**: Page loads successfully on desktop Chrome
- ✅ **TC-SU-002**: Page loads successfully on mobile Safari
- ✅ **TC-SU-003**: Upload interface is accessible via keyboard navigation
- ✅ **TC-SU-004**: File restrictions are clearly displayed

---

### Step 2: Select Script File
**User Action**: Sofia either drags her PDF file onto the upload zone or clicks "Choose File" to browse

**System Response**:
- File selection dialog opens (if browsing)
- File validation occurs immediately after selection
- Preview of selected file appears (name, size, type)
- Upload button becomes enabled if file is valid

**Success Criteria**:
- File selection works via both drag-drop and browse
- Invalid files are rejected with clear error message
- File preview shows accurate metadata

**Test Scenarios**:
- ✅ **TC-SU-005**: Drag and drop PDF file successfully
- ✅ **TC-SU-006**: Browse and select PDF file successfully
- ✅ **TC-SU-007**: Drag and drop TXT file successfully
- ❌ **TC-SU-008**: Reject unsupported file types (DOCX, JPG, etc.)
- ❌ **TC-SU-009**: Reject files larger than 10MB
- ❌ **TC-SU-010**: Reject empty or corrupted files
- ✅ **TC-SU-011**: Display file metadata (name, size, type)

---

### Step 3: Enter Script Metadata
**User Action**: Sofia enters optional script title and selects expected language

**System Response**:
- Title field pre-filled with filename (without extension)
- Language dropdown shows options: Spanish, English, Auto-detect
- Form validation occurs on input
- Upload button remains enabled for valid inputs

**Success Criteria**:
- Title defaults to meaningful filename
- Language selection includes user's preferred options
- Form validation provides immediate feedback

**Test Scenarios**:
- ✅ **TC-SU-012**: Title auto-fills from filename
- ✅ **TC-SU-013**: User can edit title field
- ✅ **TC-SU-014**: Language dropdown includes es/en/auto options
- ✅ **TC-SU-015**: Form validation for title length (max 200 chars)
- ✅ **TC-SU-016**: Special characters in title are handled correctly

---

### Step 4: Upload Script
**User Action**: Sofia clicks "Upload Script" button

**System Response**:
- Upload progress indicator appears
- File upload begins with progress percentage
- Server receives file and validates it
- Initial processing starts (text extraction)

**Success Criteria**:
- Upload progress is clearly visible
- Upload completes within 30 seconds for 10MB file
- User receives immediate feedback on upload status

**Test Scenarios**:
- ✅ **TC-SU-017**: Progress bar displays during upload
- ✅ **TC-SU-018**: Upload completes successfully for valid PDF
- ✅ **TC-SU-019**: Upload completes successfully for valid TXT
- ❌ **TC-SU-020**: Upload fails gracefully for network interruption
- ❌ **TC-SU-021**: Upload fails gracefully for server error
- ⚡ **TC-SU-022**: Large file (8MB) uploads within 30 seconds

---

### Step 5: Processing Initiation
**User Action**: Sofia waits for initial processing to complete

**System Response**:
- Processing status indicator shows "Analyzing..."
- Text extraction occurs (for PDF files)
- Language detection begins
- User receives script ID and can navigate to script page

**Success Criteria**:
- Processing status is clearly communicated
- User can navigate away and return to check progress
- Text extraction completes within 10 seconds

**Test Scenarios**:
- ✅ **TC-SU-023**: Processing status displays correctly
- ✅ **TC-SU-024**: Text extraction succeeds for standard PDF
- ✅ **TC-SU-025**: Text extraction succeeds for scanned PDF (OCR)
- ✅ **TC-SU-026**: Language detection identifies Spanish correctly
- ✅ **TC-SU-027**: Language detection identifies English correctly
- ❌ **TC-SU-028**: Processing fails gracefully for corrupted PDF
- ⚡ **TC-SU-029**: Text extraction completes within 10 seconds

---

### Step 6: Upload Confirmation
**User Action**: Sofia sees confirmation that upload was successful and processing has begun

**System Response**:
- Success message displays with script ID
- Link to script page is provided
- Processing status shows next steps (character detection)
- Option to upload another script is available

**Success Criteria**:
- Clear confirmation of successful upload
- User can access uploaded script immediately
- Next steps in the process are communicated

**Test Scenarios**:
- ✅ **TC-SU-030**: Success message displays with script ID
- ✅ **TC-SU-031**: Link to script page works correctly
- ✅ **TC-SU-032**: Script appears in user's script list
- ✅ **TC-SU-033**: Processing status shows "analyzing"
- ✅ **TC-SU-034**: User can upload additional scripts

## Decision Points

### File Type Validation
**Decision**: What happens when user selects unsupported file type?
**Path A**: Show error message, allow re-selection
**Path B**: Automatically filter file browser to supported types

**Current Implementation**: Path A (more flexible)

### Processing Time Communication
**Decision**: How to handle long processing times?
**Path A**: Show estimated time remaining
**Path B**: Send email notification when complete
**Path C**: Allow user to leave page and return later

**Current Implementation**: Path C with option for Path B in future

## Error Scenarios

### Network Errors
**Scenario**: Sofia's internet connection drops during upload
**Expected Behavior**:
- Upload pauses and shows retry option
- Progress is preserved where possible
- Clear error message explains the issue
- User can retry without losing progress

**Test Cases**:
- ❌ **TC-SU-E001**: Handle network interruption gracefully
- ❌ **TC-SU-E002**: Retry mechanism works correctly
- ❌ **TC-SU-E003**: Progress preservation during retry

### Server Errors
**Scenario**: ScripTeam server is temporarily unavailable
**Expected Behavior**:
- Friendly error message explains temporary issue
- Suggestion to try again in a few minutes
- Option to be notified when service is restored

**Test Cases**:
- ❌ **TC-SU-E004**: Handle 500 server error gracefully
- ❌ **TC-SU-E005**: Handle 503 service unavailable gracefully
- ❌ **TC-SU-E006**: Display helpful error messages

### File Processing Errors
**Scenario**: PDF is corrupted or text cannot be extracted
**Expected Behavior**:
- Clear explanation of the issue
- Suggestions for fixing the file
- Option to try different file format

**Test Cases**:
- ❌ **TC-SU-E007**: Handle corrupted PDF gracefully
- ❌ **TC-SU-E008**: Handle password-protected PDF
- ❌ **TC-SU-E009**: Handle image-only PDF with OCR failure

### Rate Limiting
**Scenario**: Sofia uploads multiple files quickly and hits rate limit
**Expected Behavior**:
- Clear explanation of rate limit (5 uploads per minute)
- Show time remaining until she can upload again
- Allow queuing additional uploads

**Test Cases**:
- ❌ **TC-SU-E010**: Rate limit enforced correctly (5 uploads/minute)
- ❌ **TC-SU-E011**: Rate limit message is user-friendly
- ❌ **TC-SU-E012**: Timer shows when uploads are available again

## Performance Requirements

### Upload Speed
- **Target**: 1MB per 2 seconds upload speed
- **Maximum**: 30 seconds for 10MB file
- **Measurement**: Track actual upload times by file size

### Processing Speed
- **Text Extraction**: <10 seconds for typical PDF
- **Language Detection**: <3 seconds after text extraction
- **Total Initial Processing**: <15 seconds end-to-end

### Response Times
- **Page Load**: <2 seconds for upload interface
- **File Validation**: <1 second after file selection
- **Upload Initiation**: <1 second after button click

## Accessibility Requirements

### Keyboard Navigation
- ✅ All upload interface elements accessible via keyboard
- ✅ Tab order is logical and intuitive
- ✅ File selection works with keyboard commands

### Screen Reader Compatibility
- ✅ Upload area has appropriate ARIA labels
- ✅ Progress indicators are announced to screen readers
- ✅ Error messages are immediately announced

### Visual Accessibility
- ✅ Upload interface works with high contrast mode
- ✅ Color is not the only indicator of upload status
- ✅ Text meets WCAG AA contrast requirements

## Mobile Experience

### Responsive Design
- ✅ Upload interface adapts to mobile screen sizes
- ✅ Touch targets are appropriately sized (44px minimum)
- ✅ File selection works on mobile devices

### Mobile-Specific Features
- ✅ Camera integration for document scanning (future)
- ✅ File manager integration works correctly
- ✅ Upload progress visible in mobile browser

## Success Metrics

### Completion Metrics
- **Upload Success Rate**: >95% of valid files upload successfully
- **Processing Success Rate**: >90% of uploads process without errors
- **User Completion Rate**: >85% of users complete entire upload flow

### Performance Metrics
- **Average Upload Time**: <15 seconds for typical 2MB PDF
- **Average Processing Time**: <20 seconds end-to-end
- **Error Recovery Rate**: >80% of users successfully retry after errors

### User Experience Metrics
- **Task Satisfaction**: >4.0/5.0 rating for upload experience
- **Ease of Use**: >90% of users complete upload without help
- **Error Understanding**: >85% of users understand error messages

## Future Enhancements

### Planned Features (Phase 2)
- **Batch Upload**: Upload multiple scripts simultaneously
- **Cloud Storage Integration**: Import from Google Drive, Dropbox
- **OCR Enhancement**: Better scanned document processing
- **Preview Mode**: Preview extracted text before processing

### Potential Features (Phase 3)
- **Collaborative Upload**: Share scripts with classmates/colleagues
- **Version Control**: Upload updated versions of existing scripts
- **Format Conversion**: Support for DOCX, RTF formats
- **AI Enhancement**: Auto-correct common script formatting issues

---

*This journey serves as the foundation for all subsequent ScripTeam features. A smooth upload experience is critical for user adoption and satisfaction.*