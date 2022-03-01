pipeline {
    agent {
        docker {
            image 'node:lts-bullseye-slim' 
            args '-p 3000:3000' 
        }
    }
    stages {
        stage('Build') { 
            steps {
                sh 'npm install' 
            }
        }
        stage('Test') {
            steps {
                sh 'chmod a+rx ./test.sh'
                sh './jenkins/test.sh'
            }
        }
        stage('Deliver') { 
            steps {
                sh 'chmod a+rx ./jenkins/deliver.sh'
                sh 'chmod a+rx ./jenkins/kill.sh'
                sh './jenkins/deliver.sh' 
                input message: 'Finished using the web site? (Click "Proceed" to continue)' 
                sh './jenkins/kill.sh' 
            }
        }
    }
}