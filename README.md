# 🩺 LiverProfile AI

**Advanced AI-Powered Liver Segmentation and Analysis for Medical Imaging**

LiverProfile AI is a state-of-the-art deep learning system designed for automatic liver segmentation and morphological analysis from 3D MRI volumes. Built on the SRMA-Mamba architecture, it provides accurate, real-time liver segmentation with comprehensive medical reporting capabilities.

## 📋 Overview

LiverProfile AI leverages cutting-edge Mamba-based neural networks to automatically identify and segment liver tissue in MRI scans. The system supports both T1-weighted and T2-weighted MRI sequences, making it versatile for various clinical imaging protocols. Beyond segmentation, LiverProfile AI provides detailed morphological analysis including volume calculations, shape metrics, and automated medical reports.

### What It Does

- **Automatic Liver Segmentation**: Accurately identifies and segments liver tissue in 3D MRI volumes
- **Multi-Modality Support**: Works with both T1-weighted and T2-weighted MRI sequences
- **Morphological Analysis**: Calculates liver volume, surface area, and shape characteristics
- **Medical Reporting**: Generates comprehensive reports with clinical insights
- **Interactive Visualization**: Slice-by-slice viewing with segmentation overlays
- **Export Capabilities**: Download segmentation masks in standard NIfTI format

## 🎯 Key Features

### Core Capabilities
- ✅ **High Accuracy**: 99.09% pixel accuracy, 75% IoU
- ✅ **Real-Time Processing**: GPU-accelerated inference with optimized memory management
- ✅ **3D Volume Support**: Handles full 3D MRI volumes using sliding window inference
- ✅ **Interactive UI**: User-friendly interface with real-time visualization
- ✅ **REST API**: Programmatic access via FastAPI for integration into clinical workflows
- ✅ **Medical Reports**: Automated generation of clinical analysis reports

### Technical Highlights
- **Architecture**: Spatial Reverse Mamba Attention (SRMA-Mamba) Network
- **Optimization**: Dynamic memory management for various GPU configurations
- **Performance**: Optimized for L40S (48GB), A100, and other high-VRAM GPUs
- **Format Support**: Standard NIfTI (.nii.gz) input/output

## 📊 Model Performance

| Metric | Value |
|--------|-------|
| **Pixel Accuracy** | 99.09% |
| **IoU (Intersection over Union)** | 75% |
| **PSNR** | 29.64 dB |
| **SSIM** | 0.24 |

## 🚀 Quick Start

### Using the Web Interface

1. **Upload** a 3D NIfTI MRI volume (`.nii.gz` format)
2. **Select** the MRI modality (T1 or T2)
3. **Click** "Segment Liver" to run inference
4. **View** the segmentation overlay and medical report
5. **Download** the 3D segmentation mask

### Using the API

```python
import requests

# Upload and segment
with open('liver_scan.nii.gz', 'rb') as f:
    response = requests.post(
        'https://your-api-url/api/segment',
        files={'file': f},
        data={'modality': 'T1'}
    )
    
result = response.json()
# Access segmentation file, volume, and report
```

## 📁 Supported Formats

- **Input**: NIfTI format (`.nii.gz`, `.nii`)
- **Output**: NIfTI binary segmentation mask (`.nii.gz`)
- **Modalities**: T1-weighted MRI, T2-weighted MRI

## 🔧 Installation

### Requirements

- Python 3.10+
- CUDA-capable GPU (recommended: 24GB+ VRAM for optimal performance)
- PyTorch 2.0+
- MONAI
- React 18+ with TypeScript

### Setup

```bash
# Clone the repository
git clone https://github.com/HarshithReddy01/frontend-SRMA-Liver.git

# Install dependencies
npm install

# Run the application
npm run dev
```

## 🏗️ Architecture

LiverProfile AI is built on the **SRMA-Mamba** (Spatial Reverse Mamba Attention) architecture, which combines:

- **Mamba-based Encoder**: Efficient state-space models for long-range dependencies
- **Spatial Reverse Attention**: Captures multi-scale spatial features
- **Multi-Resolution Processing**: Handles various volume sizes through sliding window inference
- **Attention Mechanisms**: Multi-head attention for feature refinement

### Processing Pipeline

1. **Preprocessing**: Normalization and intensity adjustment
2. **Sliding Window Inference**: Processes large volumes in overlapping windows
3. **Post-processing**: Morphological operations and mask refinement
4. **Analysis**: Volume calculation and shape metrics
5. **Report Generation**: Automated clinical report creation

## 💻 API Documentation

### Endpoints

#### `POST /api/segment`
Upload a NIfTI file for liver segmentation.

**Parameters:**
- `file`: NIfTI file (multipart/form-data)
- `modality`: "T1" or "T2" (default: "T1")
- `slice_idx`: Optional slice index for visualization

**Response:**
```json
{
  "success": true,
  "volume_ml": 1234.56,
  "segmentation_path": "/path/to/mask.nii.gz",
  "report": "Medical report text...",
  "segmentation_file": "base64_encoded_file"
}
```

#### `GET /api/health`
Check API health and model status.

**Response:**
```json
{
  "status": "healthy",
  "device": "cuda",
  "model_t1_loaded": true,
  "model_t2_loaded": true
}
```

### Interactive API Docs

Visit `/docs` for Swagger UI documentation.

## ⚙️ System Requirements

### Recommended Hardware

| GPU | VRAM | Status | Performance |
|-----|------|--------|-------------|
| **Nvidia L40S** | 48 GB | ✅ Optimal | Best performance, large batch sizes |
| **Nvidia A100** | 40-80 GB | ✅ Excellent | Production-ready |
| **Nvidia L4** | 24 GB | ⚠️ Minimum | Works with reduced settings |
| **Nvidia T4** | 16 GB | ⚠️ Limited | May require minimal settings |

### Software Requirements

- Python 3.10+
- CUDA 11.8+ (for GPU acceleration)
- 8GB+ RAM
- 10GB+ disk space for models and dependencies

## 📈 Performance Optimization

The system automatically optimizes based on available GPU memory:

- **High VRAM (>30GB)**: `roi_size=[256, 256, 96]`, `batch_size=4`
- **Medium VRAM (15-30GB)**: `roi_size=[256, 256, 64]`, `batch_size=2`
- **Low VRAM (<15GB)**: `roi_size=[192, 192, 32]`, `batch_size=1`

Memory management includes automatic fallback to minimal settings if OOM errors occur.

## 📚 Citation

If you use LiverProfile AI in your research, please cite:

```bibtex
@article{zeng2025srma,
  title={SRMA-Mamba: Spatial Reverse Mamba Attention Network for Pathological Liver Segmentation in MRI Volumes},
  author={Zeng, Jun and Huang, Yannan and Keles, Elif and Aktas, Halil Ertugrul and Durak, Gorkem and Tomar, Nikhil Kumar and Trinh, Quoc-Huy and Nayak, Deepak Ranjan and Bagci, Ulas and Jha, Debesh},
  journal={arXiv preprint arXiv:2508.12410},
  year={2025}
}
```

## ⚠️ Disclaimer

**Important**: This software is intended for **research purposes only**. It is not approved for clinical use or diagnostic purposes without proper validation and regulatory approval. Always consult with qualified medical professionals for clinical decision-making.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

## 📧 Contact

For questions, support, or collaboration inquiries:

- **Email**: harshithreddy0117@gmail.com
- **Hugging Face Space**: [srmamamba-liver-segmentation](https://huggingface.co/spaces/HarshithReddy01/srmamamba-liver-segmentation)

## 📄 License

This project is provided for research and educational purposes. Please refer to the original SRMA-Mamba paper for licensing details.

---

**LiverProfile AI** - *Empowering Medical Imaging with AI*

*Built with ❤️ for the medical imaging community*
