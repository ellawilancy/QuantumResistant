# Quantum-Resistant Secret Sharing

This project implements a quantum-resistant secret sharing system using threshold cryptography on the Stacks blockchain. It provides a secure, distributed storage solution for highly sensitive information that's designed to be resistant to potential quantum computing attacks.

## Features

- Create secrets with customizable thresholds and total shares
- Submit individual shares securely
- Reconstruct secrets when the threshold number of shares is met
- Mock implementations of post-quantum cryptographic operations (hashing, encryption, decryption, signing, and verification)

## Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet): Clarity smart contract development tools
- [Node.js](https://nodejs.org/) (v14 or later)
- [Vitest](https://vitest.dev/) for running tests

## Setup

1. Clone the repository:
