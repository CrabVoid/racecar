#include <stdio.h>
#include <stdlib.h>
#include <conio.h> // For _kbhit() and _getch()
#include <unistd.h> // For usleep()

#define WIDTH 40
#define HEIGHT 20
#define PADDLE_HEIGHT 3
#define PADDLE_CHAR '|'
#define BALL_CHAR 'O'

void draw(int ball_x, int ball_y, int paddle1_y, int paddle2_y) {
    system("clear"); // Clear the console (Linux/Mac)
    // system("cls"); // Uncomment for Windows

    for (int y = 0; y < HEIGHT; y++) {
        for (int x = 0; x < WIDTH; x++) {
            if (x == 0) {
                if (y >= paddle1_y && y < paddle1_y + PADDLE_HEIGHT) {
                    putchar(PADDLE_CHAR);
                } else {
                    putchar(' ');
                }
            } else if (x == WIDTH - 1) {
                if (y >= paddle2_y && y < paddle2_y + PADDLE_HEIGHT) {
                    putchar(PADDLE_CHAR);
                } else {
                    putchar(' ');
                }
            } else if (x == ball_x && y == ball_y) {
                putchar(BALL_CHAR);
            } else {
                putchar(' ');
            }
        }
        putchar('\n');
    }
}

int main() {
    int ball_x = WIDTH / 2, ball_y = HEIGHT / 2;
    int ball_dir_x = 1, ball_dir_y = 1;
    int paddle1_y = HEIGHT / 2 - PADDLE_HEIGHT / 2;
    int paddle2_y = HEIGHT / 2 - PADDLE_HEIGHT / 2;

    while (1) {
        draw(ball_x, ball_y, paddle1_y, paddle2_y);

        // Update ball position
        ball_x += ball_dir_x;
        ball_y += ball_dir_y;

        // Ball collision with top and bottom walls
        if (ball_y <= 0 || ball_y >= HEIGHT - 1) {
            ball_dir_y *= -1; // Reverse direction
        }

        // Ball collision with paddles
        if (ball_x == 1 && ball_y >= paddle1_y && ball_y < paddle1_y + PADDLE_HEIGHT) {
            ball_dir_x *= -1;
        }
        if (ball_x == WIDTH - 2 && ball_y >= paddle2_y && ball_y < paddle2_y + PADDLE_HEIGHT) {
            ball_dir_x *= -1;
        }

        // Check for scoring
        if (ball_x < 0 || ball_x >= WIDTH) {
            ball_x = WIDTH / 2;
            ball_y = HEIGHT / 2;
            ball_dir_x *= -1; // Reset ball direction
        }

        // Handle paddle movement
        if (_kbhit()) {
            char ch = _getch();
            switch (ch) {
                case 'w':
                    if (paddle1_y > 0) paddle1_y--;
                    break;
                case 's':
                    if (paddle1_y < HEIGHT - PADDLE_HEIGHT) paddle1_y++;
                    break;
                case 'i':
                    if (paddle2_y > 0) paddle2_y--;
                    break;
                case 'k':
                    if (paddle2_y < HEIGHT - PADDLE_HEIGHT) paddle2_y++;
                    break;
                case 'q':
                    return 0; // Quit
            }
        }

        usleep(100000); // Sleep for 100 ms
    }

    return 0;
}