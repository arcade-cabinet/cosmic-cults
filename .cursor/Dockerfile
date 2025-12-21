FROM rust:1.92.0-trixie

WORKDIR /workspace

RUN apt-get update -qq && \
    apt-get install -yqq --no-install-recommends \
    # Build essentials
    build-essential \
    pkg-config \
    # SSL/TLS
    libssl-dev \
    ca-certificates \
    # Graphics/Windowing dependencies for Bevy
    libudev-dev \
    libasound2-dev \
    libx11-dev \
    libxi-dev \
    libgl1-mesa-dev \
    libglu1-mesa-dev \
    libxcursor-dev \
    libxrandr-dev \
    libxinerama-dev \
    libwayland-dev \
    libxkbcommon-dev \
    libvulkan-dev \
    libwayland-cursor0 \
    libwayland-egl1 \
    mesa-vulkan-drivers \
    # Development tools
    curl \
    wget \
    git \
    # Python dependencies for various packages
    libffi-dev \
    libxml2-dev \
    libxslt1-dev \
    libjpeg-dev \
    zlib1g-dev \
    libpng-dev \
    # Audio/Video processing (for game assets)
    ffmpeg \
    libavcodec-dev \
    libavformat-dev \
    # Process management
    procps \
    htop \
    # Archive tools
    unzip \
    # Network tools
    net-tools \
    # For downloading pre-built binaries
    jq \
    # For UI automation tests
    xvfb \
    x11-utils \
    scrot \
    && rm -rf /var/lib/apt/lists/*

RUN curl -L --proto '=https' --tlsv1.2 -sSf https://raw.githubusercontent.com/cargo-bins/cargo-binstall/main/install-from-binstall-release.sh | bash

RUN cargo binstall --no-confirm cargo-watch cargo-edit cargo-audit cargo-outdated sqlx-cli

