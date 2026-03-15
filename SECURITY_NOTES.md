# Security Notes

## Flutter Generated Files

### GeneratedPluginRegistrant.java
- **Issue**: Broad exception handling (catching `Exception`)
- **Status**: This is a Flutter-generated file and should not be manually edited
- **Recommendation**: The broad exception handling is intentional to allow plugin registration to continue even if individual plugins fail
- **Risk Level**: Low - This is acceptable for plugin initialization where graceful degradation is desired
- **Action**: No action needed - this is standard Flutter behavior

## Fixed Security Issues

### Critical Issues (Fixed)
1. ✅ Code injection in `agents/index.ts` - Sanitized task parameter
2. ✅ Code injection in `agents/automation/agent.ts` (fillForm) - Sanitized formUrl parameter
3. ✅ Code injection in `agents/automation/agent.ts` (extractData) - Sanitized url and dataPoints parameters

### High Severity Issues (Fixed)
4. ✅ Log injection in `agents/example.ts` (6 instances) - Sanitized all log outputs to remove newline characters

### Medium Severity Issues (Fixed)
5. ✅ S3 bucket sniping in `agents/voice/agent.ts` - Changed to use environment variable
6. ✅ Improper initialization in `agents/load-env.js` - Added empty value check
7. ✅ Unscoped npm package in `agents/package.json` - Added @polis scope

### Low Severity Issues
8. ℹ️ Poor error handling in Flutter generated file - Acceptable by design

## Remaining Issue: flutter_bootstrap.js

The deserialization warning in `web/flutter_bootstrap.js` is a false positive. The file contains template placeholders (`{{flutter_js}}` and `{{flutter_build_config}}`) that are replaced by Flutter's build system, not runtime deserialization of untrusted data.
