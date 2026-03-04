#!/usr/bin/env python3
"""
Convert Hugging Face PyTorch model to ONNX format for React Native
Model: linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification
"""

import torch
from transformers import MobileNetV2ForImageClassification, MobileNetV2ImageProcessor
import os

def convert_to_onnx():
    """Convert PyTorch model to ONNX format"""
    
    model_name = "linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification"
    output_path = "plant_disease_mobilenetv2.onnx"
    
    print(f"🔄 Loading model: {model_name}")
    
    # Load the PyTorch model
    model = MobileNetV2ForImageClassification.from_pretrained(model_name)
    model.eval()
    
    print("✅ Model loaded successfully")
    print(f"   Classes: {model.config.num_labels}")
    print(f"   Input size: {model.config.image_size}")
    
    # Create dummy input matching the model's expected input
    # Shape: [batch_size, channels, height, width]
    batch_size = 1
    dummy_input = torch.randn(batch_size, 3, 224, 224)
    
    print(f"\n🔄 Converting to ONNX...")
    print(f"   Input shape: {dummy_input.shape}")
    
    # Export to ONNX (single file, no external data)
    torch.onnx.export(
        model,
        dummy_input,
        output_path,
        input_names=["pixel_values"],
        output_names=["logits"],
        dynamic_axes={
            "pixel_values": {0: "batch_size"},
            "logits": {0: "batch_size"}
        },
        opset_version=11,  # Compatible with onnxruntime-react-native
        do_constant_folding=True,
        export_params=True,
    )
    
    # Ensure single-file model (embed all data, no external files)
    import onnx
    from onnx.external_data_helper import convert_model_from_external_data
    onnx_model = onnx.load(output_path)
    onnx.save_model(onnx_model, output_path, save_as_external_data=False)
    
    # Verify the file was created
    if os.path.exists(output_path):
        file_size = os.path.getsize(output_path) / (1024 * 1024)  # MB
        print(f"\n✅ ONNX model created successfully!")
        print(f"   Output: {output_path}")
        print(f"   Size: {file_size:.2f} MB")
        print(f"\n📋 Next steps:")
        print(f"   1. Copy {output_path} to assets/models/plant_disease.onnx")
        print(f"   2. Update ModelManager.ts to use ONNX Runtime")
    else:
        print(f"\n❌ Failed to create ONNX model")
        return False
    
    return True

if __name__ == "__main__":
    try:
        convert_to_onnx()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

