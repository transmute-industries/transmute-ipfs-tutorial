# Transmute Minikube Tutorial

## What is Minikube?

You should really read more about it here: [https://kubernetes.io/docs/setup/minikube/](https://kubernetes.io/docs/setup/minikube/). Essentially, its a way to run kubernetes clusters locally, useful for developing and testing.


## How do I use it?

### [Install Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/)

Once its installed, you need to start a local cluster:

```
minikube start
```

Once its started, you can see services running in it via:

```
minikube service list
```

You can open the dashboard in a browser via:

```
minikube -n kube-system service kubernetes-dashboard
```

Next, you will want to use helm or kubectl to install a service. We'll use helm:

```
helm init
helm search ipfs
helm install stable/ipfs --name transmute-storage --set service.type=NodePort
```

Because minikube is for testing, you will often need to configure services to be exposed as `--set service.type=NodePort`, or similar.

To check the status of the ipfs service, use kubectl:

```
kubectl get pods
```

Now use minikube to get the service url for ipfs:

```
minikube service --url transmute-storage-ipfs
```

The first is the exposed IPFS API, the second is the exposed IPFS Gateway. The IP and PORT will be different, but you can verify that IPFS is running correctly, by accessing the README via the IPFS gateway.

> http://192.168.99.100:30112/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme

Congrats, you have successfully deployed a helm chart to minikube!