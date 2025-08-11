#!/bin/bash

SESSION="selfie"

echo "sudo docker start selfie"
sudo docker start selfie

echo "cd ~/GITHUB/Selfie"
cd ~/GITHUB/Selfie || exit 1

# Start tmux session
echo "tmux new-session -d -s $SESSION -c ~/GITHUB/Selfie"
tmux new-session -d -s "$SESSION" -c ~/GITHUB/Selfie

# Run node backend in the left pane
echo "Running: node Express/app.js"
tmux send-keys -t "$SESSION" "node Express/app.js" C-m

# Split vertically and run frontend in right pane
echo "Splitting pane and running: cd Angular && ng serve"
tmux split-window -h -t "$SESSION" -c ~/GITHUB/Selfie/Angular
tmux send-keys -t "$SESSION":0.1 "ng serve" C-m

# Attach to session
echo "Attaching to tmux session..."
tmux attach -t "$SESSION"
