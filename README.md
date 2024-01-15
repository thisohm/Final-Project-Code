# Transcribe and prepare a draft meeting minutes web application (Final Project)
- **CRUD**
- **RESTful APIs**
- **Call VATAYA service API from NECTEC (Transcribe)**


## Tech stack 
**React, TypeScript, Ant Design, Node.js, Express.js, MariaDB**

## Tools
- **Visual Studio Code** [Download](https://code.visualstudio.com/)
- **Docker Desktop** [Download](https://www.docker.com/products/docker-desktop/)

## Features
- **Create, edit and delete the meeting**
- **Transcribe the meeting to text**
- **Split text according to specified time**
- **Add, edit, delete and copy text**
- **Search keyword (Search text)**
- **Export text as Docx or Txt file**

## Getting Started

### Setup - Docker
First, you need to install and setup Docker Desktop. </br>
- **Open PowerShell as Administrator and run :** </br>
```bash
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```
and then restart your computer

- **Download and install Linux kernel update package**
[Download](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi)

- **Open PowerShell as Administrator and run :** </br>

```bash
wsl --set-default-version 2
```

- **Download Ubuntu from Microsoft Store**
[Download](https://apps.microsoft.com/detail/9PDXGNCFSCZV?hl=en-us&gl=US)</br>
When the download is complete, press Launch and you will be taken to the cmd page of Ubuntu. Complete the creation of User and Password.

- **Download Docker Desktop**
[Download](https://apps.microsoft.com/detail/9PDXGNCFSCZV?hl=en-us&gl=US](https://docs.docker.com/desktop/install/windows-install/)https://docs.docker.com/desktop/install/windows-install/)</br>
When install is finished , following this steps
  - **Settings > General**
  - **Tick the box "Use the WSL 2 based engine"**
  - **Press apply and restart**
  - **Open PowerShell as Administrator and run :** </br>
    ```bash
    wsl --set-version ubuntu 2
    ```
  - **Settings > Resources > WSL Integration**
  - **Tick the "Enable integration with my default WSL distro" and choose distributions to Ubuntu**
  - **Press apply and restart**
    
### Setup - Backend
Create a container for backend, following this steps
  - **Dev Environments > Create > Get Started**
  - **Choose source and select local directory** </br>
    ```bash
    ..\project\backend
    ```
  - **Press continue and finish**

when create container is finished, following this steps to run backend server and service
  - **Container > backend > ohmohm-backend (run backend)**
  - **Click terminal and run :** </br>
    ```bash
    npm run dev
    ```
  - **Container > backend > ohmohm-service (run service)**
  - **Click terminal and run :** </br>
    ```bash
    python setup.py
    ```

### Setup - Frontend


