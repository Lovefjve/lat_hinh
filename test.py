import os
import re

# Thay đổi đường dẫn đến thư mục chứa ảnh của bạn
directory = 'img'

# Lặp qua từng tệp trong thư mục
for filename in os.listdir(directory):
    # Kiểm tra xem tệp có định dạng 'image(n).jpg' không
    match = re.match(r'image\((\d+)\)\.jpg', filename)
    if match:
        # Lấy số từ tên tệp
        number = match.group(1)
        # Tạo tên tệp mới
        new_filename = f'image{number}.jpg'
        # Đổi tên tệp
        os.rename(os.path.join(directory, filename), os.path.join(directory, new_filename))

print("Đổi tên hoàn tất!")
