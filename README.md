# Labelizer

https://github.com/user-attachments/assets/51cbe763-9a45-43dd-b0f9-c8ccd052451a

An intuitive application for labeling triplets, designed for machine learning and data annotation tasks. This application provides a flexible interface for working with any type of triplets - all you need are images of the items you're working with!

A triplet is a set of three elements: an anchor serves as the reference point, a positive element is similar to the anchor, and a negative element is dissimilar to the anchor.

Originally developed for [triplet loss-based](https://en.wikipedia.org/wiki/Triplet_loss) training of a 3D encoder deep learning model for CAD designs, but flexible enough to work with any type of triplets.

## Features

### Labeling Tab

The main tab is used to retrieve labeled triplets that will be used to train a model.

![labelling](./backend/references/assets/labelling.png)

### Validation Tab

A validation tab has been added to compare the performance across different model iterations. From the user's perspective, the task remains the same: they must choose the design most similar to the one displayed in the center. However, there is no concept of positive or negative in this context. The user provides an assessment of the model's quality.

![validation](./backend/references/assets/validation.png)

### Database Configuration Tab

This tab is used to easily interact with the database, like inserting new triplets or retrieving the results.

## Project Structure

This is a monorepo containing:

- **`backend/`** - FastAPI backend with PostgreSQL database
- **`frontend/`** - React + Vite frontend with TailwindCSS

## Getting Started

See [DEVELOPMENT.md](./DEVELOPMENT.md) for development setup instructions.
