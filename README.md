# Kubernetes-Graph-Visualizer

WebGL accelerated kubernetes cluster visualization, powered by [`cytoscape`](https://js.cytoscape.org/).


## Examples

![Example screenshot with menu open](./assets/menu.png)
![Example screenshot with description open](./assets/description.png)

(Graph without Icons)
![Example screenshot without icons](./assets/without-icons.png)


## Colors, icons & links

Nodes are normally displayed as their respective type icon, but these icons can also be disabled. 
When disabled, nodes are color-coded by their types (for example, all `pods` in the screenshot above are colored cyan).

Links between nodes are created according to rules, which can be toggled in the UI.
These links are color-coded depending on namespaces, with non-namespaced links being white.


## Usage

Create a production build using npm:
```sh
npm run build
```

Run the build with Node.js:
```sh
ORIGIN=http://localhost:8000 PORT=8000 node build
```

The GUI should be accessible under [`http://localhost:8000/gui`](http://localhost:8000/gui).

Per default, the kubernetes API server configured in `~/.kube/config` will be used.
For advanced usage (such as exposing the server on your network) see the [node-adapter](https://svelte.dev/docs/kit/adapter-node) docs.


## Future roadmap

- Support for other types of objects
- Rule improvements
  - Job
  - CronJob
  - ConfigMap
  - ...


## Kubernetes objects support

| **SUPPORT** | OBJECT                           | API                               | NAMESPACED | ICON                                                                                                                                   |
|-------------|----------------------------------|-----------------------------------|------------|----------------------------------------------------------------------------------------------------------------------------------------|
| **Yes**     | Endpoints                        | v1                                | true       | ![](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/ep-128.png)                   |
| **Yes**     | Namespace                        | v1                                | false      | ![](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/ns-128.png)                   |
| **Yes**     | Node                             | v1                                | false      | ![](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/infrastructure_components/labeled/node-128.png) |
| **Yes**     | Pod                              | v1                                | true       | ![](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/pod-128.png)                  |
| **Yes**     | ReplicationController            | v1                                | true       | ![](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/rs-128.png)                   |
| **Yes**     | ServiceAccount                   | v1                                | true       | ![](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/sa-128.png)                   |
| **Yes**     | Service                          | v1                                | true       | ![](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/svc-128.png)                  |
| **Yes**     | Secret                           | v1                                | true       | ![](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/secret-128.png)               |
| **Yes**     | ConfigMap                        | v1                                | true       | ![](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/cm-128.png)                   |
| **Yes**     | DaemonSet                        | apps/v1                           | true       | ![](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/ds-128.png)                   |
| **Yes**     | Deployment                       | apps/v1                           | true       | ![](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/deploy-128.png)               |
| **Yes**     | ReplicaSet                       | apps/v1                           | true       | ![](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/rs-128.png)                   |
| **Yes**     | StatefulSet                      | apps/v1                           | true       | ![](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/sts-128.png)                  |
| **Yes**     | Job                              | batch/v1                          | true       | ![](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/job-128.png)                  |
| **Yes**     | CronJob                          | batch/v1                          | true       | ![](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/cronjob-128.png)              |
| **Yes**     | ClusterRoleBinding               | rbac.authorization.k8s.io/v1      | false      | ![](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/crb-128.png)                  |
| **Yes**     | ClusterRole                      | rbac.authorization.k8s.io/v1      | false      | ![](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/c-role-128.png)               |
| **Yes**     | RoleBinding                      | rbac.authorization.k8s.io/v1      | true       | ![](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/rb-128.png)                   |
| **Yes**     | Role                             | rbac.authorization.k8s.io/v1      | true       | ![](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/role-128.png)                 |
| **Yes**     | CustomResourceDefinition         | apiextensions.k8s.io/v1           | false      | ![](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/crd-128.png)                  |
| No          | Binding                          | v1                                | true       |                                                                                                                                        |
| No          | ComponentStatus                  | v1                                | false      |                                                                                                                                        |
| No          | Event                            | v1                                | true       |                                                                                                                                        |
| No          | LimitRange                       | v1                                | true       |                                                                                                                                        |
| No          | PersistentVolumeClaim            | v1                                | true       |                                                                                                                                        |
| No          | PersistentVolume                 | v1                                | false      |                                                                                                                                        |
| No          | PodTemplate                      | v1                                | true       |                                                                                                                                        |
| No          | ResourceQuota                    | v1                                | true       |                                                                                                                                        |
| No          | MutatingWebhookConfiguration     | admissionregistration.k8s.io/v1   | false      |                                                                                                                                        |
| No          | ValidatingAdmissionPolicy        | admissionregistration.k8s.io/v1   | false      |                                                                                                                                        |
| No          | ValidatingAdmissionPolicyBinding | admissionregistration.k8s.io/v1   | false      |                                                                                                                                        |
| No          | ValidatingWebhookConfiguration   | admissionregistration.k8s.io/v1   | false      |                                                                                                                                        |
| No          | APIService                       | apiregistration.k8s.io/v1         | false      |                                                                                                                                        |
| No          | ControllerRevision               | apps/v1                           | true       |                                                                                                                                        |
| No          | SelfSubjectReview                | authentication.k8s.io/v1          | false      |                                                                                                                                        |
| No          | TokenReview                      | authentication.k8s.io/v1          | false      |                                                                                                                                        |
| No          | LocalSubjectAccessReview         | authorization.k8s.io/v1           | true       |                                                                                                                                        |
| No          | SelfSubjectAccessReview          | authorization.k8s.io/v1           | false      |                                                                                                                                        |
| No          | SelfSubjectRulesReview           | authorization.k8s.io/v1           | false      |                                                                                                                                        |
| No          | SubjectAccessReview              | authorization.k8s.io/v1           | false      |                                                                                                                                        |
| No          | HorizontalPodAutoscaler          | autoscaling/v2                    | true       |                                                                                                                                        |
| No          | CertificateSigningRequest        | certificates.k8s.io/v1            | false      |                                                                                                                                        |
| No          | IngressClassParameters           | configuration.konghq.com/v1alpha1 | true       |                                                                                                                                        |
| No          | KongClusterPlugin                | configuration.konghq.com/v1       | false      |                                                                                                                                        |
| No          | KongConsumerGroup                | configuration.konghq.com/v1beta1  | true       |                                                                                                                                        |
| No          | KongConsumer                     | configuration.konghq.com/v1       | true       |                                                                                                                                        |
| No          | KongCustomEntity                 | configuration.konghq.com/v1alpha1 | true       |                                                                                                                                        |
| No          | KongIngress                      | configuration.konghq.com/v1       | true       |                                                                                                                                        |
| No          | KongLicense                      | configuration.konghq.com/v1alpha1 | false      |                                                                                                                                        |
| No          | KongPlugin                       | configuration.konghq.com/v1       | true       |                                                                                                                                        |
| No          | KongUpstreamPolicy               | configuration.konghq.com/v1beta1  | true       |                                                                                                                                        |
| No          | KongVault                        | configuration.konghq.com/v1alpha1 | false      |                                                                                                                                        |
| No          | TCPIngress                       | configuration.konghq.com/v1beta1  | true       |                                                                                                                                        |
| No          | UDPIngress                       | configuration.konghq.com/v1beta1  | true       |                                                                                                                                        |
| No          | Lease                            | coordination.k8s.io/v1            | true       |                                                                                                                                        |
| No          | EndpointSlice                    | discovery.k8s.io/v1               | true       |                                                                                                                                        |
| No          | Event                            | events.k8s.io/v1                  | true       |                                                                                                                                        |
| No          | FlowSchema                       | flowcontrol.apiserver.k8s.io/v1   | false      |                                                                                                                                        |
| No          | PriorityLevelConfiguration       | flowcontrol.apiserver.k8s.io/v1   | false      |                                                                                                                                        |
| No          | IngressClass                     | networking.k8s.io/v1              | false      |                                                                                                                                        |
| No          | Ingress                          | networking.k8s.io/v1              | true       |                                                                                                                                        |
| No          | NetworkPolicy                    | networking.k8s.io/v1              | true       |                                                                                                                                        |
| No          | RuntimeClass                     | node.k8s.io/v1                    | false      |                                                                                                                                        |
| No          | PodDisruptionBudget              | policy/v1                         | true       |                                                                                                                                        |
| No          | PriorityClass                    | scheduling.k8s.io/v1              | false      |                                                                                                                                        |
| No          | CSIDriver                        | storage.k8s.io/v1                 | false      |                                                                                                                                        |
| No          | CSINode                          | storage.k8s.io/v1                 | false      |                                                                                                                                        |
| No          | CSIStorageCapacity               | storage.k8s.io/v1                 | true       |                                                                                                                                        |
| No          | StorageClass                     | storage.k8s.io/v1                 | false      |                                                                                                                                        |
| No          | VolumeAttachment                 | storage.k8s.io/v1                 | false      |                                                                                                                                        |



<!--
Icons for future use

![](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/group-128.png)
![](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/hpa-128.png)
![](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/ing-128.png)
![](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/limits-128.png)
![](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/netpol-128.png)
![](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/psp-128.png)
![](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/pv-128.png)
![](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/pvc-128.png)
![](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/quota-128.png)
![](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/sc-128.png)
![](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/user-128.png)
![](https://raw.githubusercontent.com/kubernetes/community/refs/heads/master/icons/png/resources/labeled/vol-128.png)
-->
