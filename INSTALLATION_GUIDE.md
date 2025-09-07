# NextCloud Extract Plugin Installation Guide

## Package Information
- **Plugin Name**: Extract
- **Version**: 2.0.1
- **Compatible with**: NextCloud 28-31, PHP 8.3.25
- **Package Location**: `build/artifacts/appstore/extract_2.0.1.tar.gz`

## Installation Methods

### Method 1: Manual Installation (Recommended)

1. **Download the package**:
   ```bash
   # The package is located at:
   build/artifacts/appstore/extract_2.0.1.tar.gz
   ```

2. **Upload to your NextCloud server**:
   ```bash
   # Copy the package to your NextCloud server
   scp build/artifacts/appstore/extract_2.0.1.tar.gz user@your-server:/tmp/
   ```

3. **Extract to NextCloud apps directory**:
   ```bash
   # SSH into your NextCloud server
   ssh user@your-server
   
   # Navigate to NextCloud apps directory
   cd /var/www/nextcloud/apps/
   # or wherever your NextCloud installation is located
   
   # Extract the plugin
   sudo tar -xzf /tmp/extract_2.0.1.tar.gz
   
   # Set proper permissions
   sudo chown -R www-data:www-data extract/
   sudo chmod -R 755 extract/
   ```

4. **Enable the plugin**:
   - Log into your NextCloud admin panel
   - Go to **Settings** → **Apps**
   - Find "Extract" in the list and click **Enable**

### Method 2: NextCloud App Store (Alternative)

If you want to submit this to the NextCloud App Store later:
1. The package `extract_2.0.1.tar.gz` is ready for submission
2. Follow NextCloud's app store submission guidelines

## System Requirements

### PHP 8.3 Compatibility Notes

**Important**: This version is specifically updated for PHP 8.3.25 and NextCloud 31. Key compatibility changes:

- **RAR PHP Extension**: The PECL RAR extension (4.2.0) is **NOT compatible** with PHP 8.3 due to API changes
- **Solution**: Use the `unrar` command-line tool instead (which is actually more reliable)
- **Deprecated APIs**: All deprecated NextCloud APIs have been replaced with supported alternatives

### Required Dependencies
Make sure these are installed on your server:

1. **For RAR support** (OPTIONAL - PHP 8.3 Compatibility):
   
   **Note**: RAR support is optional. The plugin works perfectly for ZIP, TAR, 7z, and other formats without RAR support.
   ```bash
   # The RAR PHP extension (pecl install rar) is NOT compatible with PHP 8.3
   # Use unrar command-line tool instead:
   
   # Ubuntu/Debian - try these options in order:
   sudo apt-get install unrar-free    # Free version (limited functionality)
   # OR if unrar-free doesn't work well:
   sudo apt-get install unar          # Alternative RAR extractor
   
   # If neither works, enable non-free repository first:
   sudo apt-get install software-properties-common
   sudo add-apt-repository multiverse  # Ubuntu
   sudo apt-get update
   sudo apt-get install unrar
   
   # CentOS/RHEL (enable EPEL first):
   sudo yum install epel-release
   sudo yum install unrar
   
   # Fedora:
   sudo dnf install unrar
   
   # Alpine Linux (Docker):
   apk add unrar
   
   # Arch Linux:
   sudo pacman -S unrar
   ```

2. **For 7z/TAR/GZIP/BZIP2 formats**:
   ```bash
   # Install p7zip (REQUIRED for these formats)
   sudo apt-get install p7zip-full  # Ubuntu/Debian
   sudo yum install p7zip p7zip-plugins   # CentOS/RHEL
   sudo dnf install p7zip p7zip-plugins   # Fedora
   sudo pacman -S p7zip               # Arch Linux
   
   # For Alpine Linux (Docker):
   apk add p7zip
   ```

3. **Formats that work without additional dependencies**:
   - ZIP files (uses built-in PHP ZIP extension)
   - Basic TAR files (uses built-in PHP functions)

### PHP Configuration
Ensure your PHP configuration supports:
- PHP 8.3.25 or compatible
- ZIP extension (usually enabled by default)
- Sufficient memory and execution time for large archives

## Verification

After installation, verify the plugin works:

1. **Check plugin status**:
   - Go to **Settings** → **Apps**
   - Confirm "Extract" shows as enabled

2. **Test functionality**:
   - Upload a ZIP file to your NextCloud
   - Right-click on the file
   - Look for "Extract" option in the context menu

## Troubleshooting

### Common Issues

1. **"Extract" option not appearing**:
   - Clear browser cache
   - Check if plugin is enabled in Apps settings
   - Verify file permissions on the extract directory

2. **Extraction fails**:
   - Check NextCloud logs: **Settings** → **Logging**
   - Verify required dependencies are installed
   - Check file permissions and disk space

3. **RAR files not working**:
   - Install unrar command-line tool (see dependencies above)
   - Verify unrar is accessible: `which unrar` should return a path
   - Check that the web server user can execute unrar
   - Restart your web server after installing

### Log Locations
- NextCloud logs: **Settings** → **Logging** in admin panel
- Web server logs: `/var/log/apache2/error.log` or `/var/log/nginx/error.log`
- PHP logs: Check your PHP configuration for log location

### Docker Installation

If you're running NextCloud in Docker, add this to your Dockerfile or docker-compose setup:

```dockerfile
# For Alpine-based images (recommended)
RUN apk add --no-cache unrar p7zip

# For Debian/Ubuntu-based images - try these options:
# Option 1: Free version (may have limitations)
RUN apt-get update && apt-get install -y unrar-free p7zip-full && rm -rf /var/lib/apt/lists/*

# Option 2: Alternative extractor
RUN apt-get update && apt-get install -y unar p7zip-full && rm -rf /var/lib/apt/lists/*

# Option 3: Enable non-free repo for full unrar (if needed)
RUN apt-get update && \
    apt-get install -y software-properties-common && \
    add-apt-repository multiverse && \
    apt-get update && \
    apt-get install -y unrar p7zip-full && \
    rm -rf /var/lib/apt/lists/*
```

Or for docker-compose, you can install at runtime:
```bash
# Enter your NextCloud container
docker exec -it your-nextcloud-container sh

# For Alpine:
apk add unrar p7zip

# For Debian/Ubuntu - try in order:
apt-get update
apt-get install -y unrar-free p7zip-full  # Free version
# OR
apt-get install -y unar p7zip-full        # Alternative
```

## Features

This updated version supports:
- ZIP archives
- RAR archives (with proper dependencies)
- TAR archives (including .tar.gz, .tar.bz2, .tar.xz)
- 7z archives
- DEB packages
- GZIP files
- BZIP2 files

## Security Notes

- The plugin automatically filters out potentially dangerous files
- Extracted files inherit the same permissions as the original archive
- Large archives may require increased PHP memory limits

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review NextCloud and web server logs
3. Verify all system requirements are met
4. Ensure proper file permissions are set