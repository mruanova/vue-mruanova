new Vue({
    el: '#project_list',
    data() {
        return {
            projects: []
        }
    },
    created() {
        const url = 'https://246gg84zg8.execute-api.us-west-2.amazonaws.com/prod/projects';
        this.$http.get(url).then(data => {
            const items = JSON.parse(data.response).Items
            items.map(project => {
                this.projects.push(project);
                addMarker(project.ProjectId, project.Name, project.Website, project.Address);
            })
        })
    }
})