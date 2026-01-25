#!/bin/bash

# 🚀 Quick Setup Script untuk Data Berbeza Setiap Submenu
# Jalankan: chmod +x setup-data.sh && ./setup-data.sh

echo "🎯 Setup Data Berbeza untuk Setiap Submenu"
echo "=========================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Fail .env tidak dijumpai!"
    echo "Sila buat .env file dengan DATABASE_URL"
    exit 1
fi

echo "✅ Fail .env dijumpai"
echo ""

# Step 1: Push schema to database
echo "📦 Step 1: Push schema ke database..."
npm run db:push

if [ $? -ne 0 ]; then
    echo "❌ Error: Gagal push schema"
    exit 1
fi

echo "✅ Schema berjaya di-push"
echo ""

# Step 2: Run seed
echo "🌱 Step 2: Masukkan data sample..."
npm run db:seed

if [ $? -ne 0 ]; then
    echo "❌ Error: Gagal run seed"
    exit 1
fi

echo "✅ Data sample berjaya dimasukkan"
echo ""

# Step 3: Summary
echo "🎉 SETUP SELESAI!"
echo "================"
echo ""
echo "📊 Data yang telah dimasukkan:"
echo ""
echo "  📍 KL-7 (Submenu 1) - Data A:"
echo "     • 101 - KPJ Damansara Specialist Hospital"
echo "     • 102 - Gleneagles Hospital Kuala Lumpur"
echo "     • 103 - Pantai Hospital Kuala Lumpur"
echo "     • 104 - Prince Court Medical Centre"
echo "     • 105 - Sunway Medical Centre"
echo ""
echo "  📍 SL-1 (Submenu 2) - Data B:"
echo "     • 201 - Selayang Hospital"
echo "     • 202 - Columbia Asia Hospital - Setapak"
echo "     • 203 - Kepong Specialist Hospital"
echo "     • 204 - Kuala Lumpur Hospital"
echo "     • 205 - Sentosa Medical Centre"
echo ""
echo "🚀 Langkah seterusnya:"
echo "   1. Jalankan: npm run dev"
echo "   2. Buka: http://localhost:3000"
echo "   3. Klik 'Route VM' di sidebar"
echo "   4. Test kedua-dua submenu"
echo ""
echo "📊 Untuk lihat data dalam database:"
echo "   npm run db:studio"
echo ""
echo "✨ Setiap submenu sekarang ada data sendiri yang berbeza!"
