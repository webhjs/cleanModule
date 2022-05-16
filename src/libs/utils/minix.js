import { mapActions } from "vuex";
// 删除当前页并清空缓存
export default {
	inject: {
		appMainTheme: {
			//函数式组件取值不一样
			default: () => ({})
		}
	},
	methods: {
		...mapActions([
			"delVisitedTabsView"
		]),
		goBackDataPage(routeConfig) {
			/* 删除当前页 */
			const { name, path, fullPath, params, query, meta } = this.$route
			const tag = {
				name, path, fullPath, params, query,
				label: meta.title
			}
			this.appMainTheme.removeCache(tag.fullPath)
			this.delVisitedTabsView(tag).then(() => {
				const { path, query, name } = routeConfig;
				function getParams(params) {
					let paramStr = '';
					Object.keys(params)
						.forEach((item) => {
							if (paramStr === '') {
								paramStr = `${item}=${params[item]}`;
							} else {
								paramStr = `${paramStr}&${item}=${params[item]}`;
							}
						});
					return paramStr;
				}
				let fullPath;
				if (name) {
					const { route } = this.$router.resolve({ name })
					const find = route.matched.find(f => f.name === name)
					fullPath = find.path
					query && (fullPath += '?' + getParams(query))
				}
				if(path) {
					fullPath = path
					query && (fullPath += '?' + getParams(query))
				}
				fullPath && this.appMainTheme.removeCache(fullPath)
				this.$router.push(routeConfig)
			});
			/* 删除当前页 */
		}
	}
}
