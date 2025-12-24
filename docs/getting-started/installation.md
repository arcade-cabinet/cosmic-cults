# Installation

## Requirements

- Python 3.9+
- [uv](https://docs.astral.sh/uv/) (recommended) or pip

## Install from PyPI

```bash
# Using uv (recommended)
uv add rust-cosmic-cults

# Using pip
pip install rust-cosmic-cults
```

## Install from Source

```bash
git clone https://github.com/jbcom/rust-cosmic-cults.git
cd rust-cosmic-cults
uv sync
```

## Development Installation

```bash
# Clone and install with dev dependencies
git clone https://github.com/jbcom/rust-cosmic-cults.git
cd rust-cosmic-cults
uv sync --extra dev --extra docs
```
