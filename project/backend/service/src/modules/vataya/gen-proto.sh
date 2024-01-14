#!/bin/bash
echo "Generating proto grpc files..."
python3 -m grpc_tools.protoc -I ./ --python_out=. --grpc_python_out=. ./vataya.proto
echo "DONE"
