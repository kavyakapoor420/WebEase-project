import sys
import cv2
from PyQt5.QtCore import Qt, QTimer
from PyQt5.QtGui import QImage, QPixmap
from PyQt5.QtWidgets import QApplication, QLabel, QMainWindow, QVBoxLayout, QWidget
import pyautogui

class FaceScrollApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Face Scroll App")
        self.setGeometry(100, 100, 640, 480)

        self.video_label = QLabel(self)
        self.video_label.setAlignment(Qt.AlignCenter)

        layout = QVBoxLayout()
        layout.addWidget(self.video_label)

        container = QWidget()
        container.setLayout(layout)
        self.setCentralWidget(container)

        self.cap = cv2.VideoCapture(0)
        if not self.cap.isOpened():
            raise Exception("Could not open webcam")

        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
        if self.face_cascade.empty():
            raise Exception("Failed to load face cascade classifier")

        self.previous_y = None

        self.timer = QTimer()
        self.timer.timeout.connect(self.update_frame)
        self.timer.start(30)  # approx 30 FPS

    def update_frame(self):
        ret, frame = self.cap.read()
        if not ret:
            return

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = []
        try:
            faces = self.face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        except Exception as e:
            print(f"Error in detectMultiScale: {e}")

        if len(faces) > 0:
            (x, y, w, h) = faces[0]
            center_y = y + h // 2

            if self.previous_y is not None:
                delta_y = center_y - self.previous_y
                # print(f"Delta Y: {delta_y}")  # Debug print
                if delta_y > 10:
                    # print("Scrolling down")
                    pyautogui.scroll(-120)  # scroll down
                elif delta_y < -10:
                    # print("Scrolling up")
                    pyautogui.scroll(120)   # scroll up

            self.previous_y = center_y

            # Draw rectangle around face
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
        else:
            self.previous_y = None

        # Convert frame to QImage for display
        rgb_image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        h, w, ch = rgb_image.shape
        bytes_per_line = ch * w
        qt_image = QImage(rgb_image.data, w, h, bytes_per_line, QImage.Format_RGB888)
        self.video_label.setPixmap(QPixmap.fromImage(qt_image))

    def closeEvent(self, event):
        self.cap.release()
        super().closeEvent(event)

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = FaceScrollApp()
    window.show()
    sys.exit(app.exec_())
