import deploymentIcon from "kubernetes-icons/svg/resources/labeled/deploy.svg";
import podIcon from "kubernetes-icons/svg/resources/labeled/pod.svg";
import nodeIcon from "kubernetes-icons/svg/infrastructure_components/labeled/node.svg";
import namespaceIcon from "kubernetes-icons/svg/resources/labeled/ns.svg";
import serviceIcon from "kubernetes-icons/svg/resources/labeled/svc.svg";
import serviceAccountIcon from "kubernetes-icons/svg/resources/labeled/sa.svg";
import replicationControllerIcon from "kubernetes-icons/svg/resources/labeled/rs.svg";
import replicaSetIcon from "kubernetes-icons/svg/resources/labeled/rs.svg";
import endpointIcon from "kubernetes-icons/svg/resources/labeled/ep.svg";
import statefulSetIcon from "kubernetes-icons/svg/resources/labeled/sts.svg";
import daemonSetIcon from "kubernetes-icons/svg/resources/labeled/ds.svg";
import jobIcon from "kubernetes-icons/svg/resources/labeled/job.svg";
import roleIcon from "kubernetes-icons/svg/resources/labeled/role.svg";
import roleBindingIcon from "kubernetes-icons/svg/resources/labeled/rb.svg";
import clusterRoleIcon from "kubernetes-icons/svg/resources/labeled/c-role.svg";
import clusterRoleBindingIcon from "kubernetes-icons/svg/resources/labeled/crb.svg";

export const iconMap: Record<string, any> = {
    V1Deployment: deploymentIcon,
    V1Pod: podIcon,
    V1Node: nodeIcon,
    V1Namespace: namespaceIcon,
    V1Service: serviceIcon,
    V1ServiceAccount: serviceAccountIcon,
    V1ReplicationController: replicationControllerIcon,
    V1ReplicaSet: replicaSetIcon,
    V1Endpoints: endpointIcon,
    V1StatefulSet: statefulSetIcon,
    V1DaemonSet: daemonSetIcon,
    V1Job: jobIcon,
    V1Role: roleIcon,
    V1RoleBinding: roleBindingIcon,
    V1ClusterRole: clusterRoleIcon,
    V1ClusterRoleBinding: clusterRoleBindingIcon
}

class IconStateWrapper {
    public display: boolean = $state(true);
}
export const iconState = new IconStateWrapper();

