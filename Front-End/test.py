import numpy as np
import matplotlib.pyplot as plt
from numpy.linalg import qr
from mpl_toolkits.mplot3d import Axes3D
from mpl_toolkits.mplot3d.art3d import Poly3DCollection

# Define matrix A
A = np.array([
    [1, 3, 1, 4],
    [3, 9, 5, 15],
    [0, 2, 1, 1],
    [0, 4, 2, 3]
])

# QR decomposition
Q, R = qr(A)

# ----------------- Figure 1.1 -------------------
fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')
ax.set_title("Figure 1.1: Matrix A as Column Vectors")

origin = np.zeros((3,))
colors = ['r', 'g', 'b']
for i in range(3):  # first 3 columns for 3D
    vec = A[:3, i]
    ax.quiver(*origin, *vec, color=colors[i], label=f"A[:,{i}]")
ax.set_xlim([0, 10])
ax.set_ylim([0, 10])
ax.set_zlim([0, 10])
ax.legend()
plt.show()



# ----------------- Figure 2.1 -------------------
A_approx = Q @ R
error = np.abs(A - A_approx)

fig, axes = plt.subplots(1, 3, figsize=(15, 4))
axes[0].imshow(A, cmap='gray')
axes[0].set_title("Original A")
axes[1].imshow(A_approx, cmap='gray')
axes[1].set_title("Reconstructed A (QR)")
axes[2].imshow(error, cmap='hot')
axes[2].set_title("Error |A - QR|")
plt.tight_layout()
plt.show()
 