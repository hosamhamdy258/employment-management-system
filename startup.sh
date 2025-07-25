#!/bin/bash
set -e

# Marker file to check if setup is done
SETUP_MARKER=/.setup_done

if [ ! -f "$SETUP_MARKER" ]; then
    echo "Running initial setup..."

    # Create logs directory
    echo "Creating logs directory..."
    mkdir -p logs
    
    # Run migrations
    echo "Running migrations..."
    python manage.py makemigrations accounts core
    python manage.py migrate
    
    # Load demo data
    echo "Loading demo data..."
    python demo_data.py
    
    # Create marker file
    touch "$SETUP_MARKER"
    echo "Initial setup completed!"
else
    echo "Setup already completed. Starting server..."
fi

# Start the development server
exec "$@"
