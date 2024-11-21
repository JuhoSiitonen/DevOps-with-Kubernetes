This is my prometheus query for this exercise and below a picture of it being used.

count(kube_pod_info{namespace="prometheus",created_by_kind="StatefulSet"})

![prometheus query](image.png)