/**
 * 오늘 뭐해먹지? - 재료 기반 레시피 검색 애플리케이션
 * 
 * 이 애플리케이션은 사용자가 보유한 재료를 입력하면
 * 한국 식품의약품안전처 공공데이터를 활용하여
 * 해당 재료로 만들 수 있는 레시피를 찾아주고
 * 보유한 재료와 추가로 필요한 재료를 구분하여 보여줍니다.
 */

// 앱 상태 관리
const appState = {
    language: 'ko', // 'ko' 또는 'en'
    isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    recentSearches: [],
    searchTerm: '',
    searchResults: [],
    selectedFood: null,
    favorites: [],
    isLoading: false,
    error: null,
    sortBy: 'matchRatio', // 'matchRatio', 'matchRatioDesc', 'name', 'nameDesc'
  };
  
  // 정렬 옵션
  const sortOptions = [
    { id: 'matchRatio', label: '일치율 높은순', icon: '↓' },
    { id: 'possessionRatio', label: '보유율 높은순', icon: '↓' },
    { id: 'name', label: '이름 가나다순', icon: '↓' },
    { id: 'nameDesc', label: '이름 가나다 역순', icon: '↑' }
  ];
  
  // 번역 데이터
  const translations = {
    ko: {
      title: "오늘 뭐해먹지?",
      searchTitle: "재료로 음식 찾기",
      searchDescription: "찾고 싶은 재료를 입력하면 해당 재료가 포함된 음식 메뉴를 보여드립니다.",
      ingredientLabel: "재료 이름",
      ingredientPlaceholder: "예: 김치, 고추장, 된장...",
      search: "검색",
      apiInfo: "식품의약품안전처 공공데이터를 이용합니다.",
      resultsTitle: "재료가 포함된 음식",
      resultsCount: "개",
      noResults: "검색 결과가 없습니다",
      noResultsDescription: "'{term}'에 대한 결과를 찾을 수 없습니다. 다른 재료를 입력하거나 검색어를 수정해 보세요.",
      newSearch: "새로운 검색 시작하기",
      details: "상세 정보",
      recipe: "레시피",
      ingredients: "포함 재료",
      ingredientsList: "재료 목록",
      fullIngredientsList: "전체 재료 정보",
      cookingSteps: "조리 방법",
      matchedIngredients: "보유 재료",
      additionalIngredients: "추가 필요 재료",
      matchRatio: "재료 일치율",
      match: "일치",
      matchExplanation: "입력한 재료 중에서 이 레시피에 사용되는 재료의 비율입니다.",
      category: "카테고리",
      nutritionInfo: "영양 정보",
      calories: "칼로리",
      carbs: "탄수화물",
      protein: "단백질",
      fat: "지방",
      sodium: "나트륨",
      foodCode: "식품 코드",
      dataSource: "데이터 제공",
      koreaFDA: "식품의약품안전처 공공데이터활용서비스",
      close: "닫기",
      addToFavorites: "즐겨찾기 추가",
      removeFromFavorites: "즐겨찾기 제거",
      share: "공유하기",
      copied: "복사 완료",
      copyToClipboard: "클립보드에 복사",
      cancel: "취소",
      shareRecipe: "레시피 공유하기",
      recipeCopiedToClipboard: "레시피가 클립보드에 복사되었습니다.",
      loading: "데이터를 불러오는 중입니다...",
      error: "오류가 발생했습니다",
      apiError: "API 연결 중 문제가 발생했습니다. 다시 시도해 주세요.",
      retry: "다시 시도하기",
      noCookingSteps: "조리 방법 정보가 없습니다",
      noCookingStepsDesc: "이 레시피에 대한 자세한 조리 방법이 제공되지 않았습니다.",
      noNutritionInfo: "영양 정보가 없습니다",
      noNutritionInfoDesc: "이 음식에 대한 자세한 영양 정보가 제공되지 않았습니다.",
    },
    en: {
      title: "What to Eat Today?",
      searchTitle: "Find Food by Ingredient",
      searchDescription: "Enter an ingredient to find menu items that contain it.",
      ingredientLabel: "Ingredient Name",
      ingredientPlaceholder: "Example: kimchi, gochujang, doenjang...",
      search: "Search",
      apiInfo: "Data from Korea Food and Drug Administration public data service.",
      resultsTitle: "foods containing",
      resultsCount: " items",
      noResults: "No Results Found",
      noResultsDescription: "No results found for '{term}'. Try a different ingredient or modify your search term.",
      newSearch: "Start a new search",
      details: "Details",
      recipe: "Recipe",
      ingredients: "Ingredients",
      ingredientsList: "Ingredients List",
      fullIngredientsList: "Complete Ingredients List",
      cookingSteps: "Cooking Steps",
      matchedIngredients: "Ingredients You Have",
      additionalIngredients: "Additional Ingredients Needed",
      matchRatio: "Ingredient Match",
      match: "match",
      matchExplanation: "Percentage of your ingredients used in this recipe.",
      category: "Category",
      nutritionInfo: "Nutrition Information",
      calories: "Calories",
      carbs: "Carbohydrates",
      protein: "Protein",
      fat: "Fat",
      sodium: "Sodium",
      foodCode: "Food Code",
      dataSource: "Data source",
      koreaFDA: "Korea Food and Drug Administration Public Data Service",
      close: "Close",
      addToFavorites: "Add to Favorites",
      removeFromFavorites: "Remove from Favorites",
      share: "Share",
      copied: "Copied",
      copyToClipboard: "Copy to Clipboard",
      cancel: "Cancel",
      shareRecipe: "Share Recipe",
      recipeCopiedToClipboard: "Recipe copied to clipboard.",
      loading: "Loading data...",
      error: "An error occurred",
      apiError: "There was a problem connecting to the API. Please try again.",
      retry: "Try Again",
      noCookingSteps: "No Cooking Steps Available",
      noCookingStepsDesc: "Detailed cooking instructions were not provided for this recipe.",
      noNutritionInfo: "No Nutrition Information",
      noNutritionInfoDesc: "Detailed nutrition information was not provided for this item.",
    }
  };
  
  // 초기화 함수
  function init() {
    // 로컬 스토리지에서 상태 복원
    loadStateFromLocalStorage();
    
    // 테마 적용
    applyTheme();
    
    // 이벤트 리스너 등록
    registerEventListeners();
    
    // 최근 검색어 표시
    renderRecentSearches();
  }
  
  // 로컬 스토리지에서 상태 로드
  function loadStateFromLocalStorage() {
    try {
      // 다크 모드 설정
      const storedDarkMode = localStorage.getItem('darkMode');
      if (storedDarkMode !== null) {
        appState.isDarkMode = storedDarkMode === 'true';
      }
      
      // 언어 설정
      const storedLanguage = localStorage.getItem('language');
      if (storedLanguage) {
        appState.language = storedLanguage;
      }
      
      // 최근 검색어
      const storedRecentSearches = localStorage.getItem('recentSearches');
      if (storedRecentSearches) {
        appState.recentSearches = JSON.parse(storedRecentSearches);
      }
      
      // 즐겨찾기
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        appState.favorites = JSON.parse(storedFavorites);
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }
  
  // 상태를 로컬 스토리지에 저장
  function saveStateToLocalStorage() {
    try {
      localStorage.setItem('darkMode', appState.isDarkMode);
      localStorage.setItem('language', appState.language);
      localStorage.setItem('recentSearches', JSON.stringify(appState.recentSearches));
      localStorage.setItem('favorites', JSON.stringify(appState.favorites));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }
  
  // 테마 적용
  function applyTheme() {
    if (appState.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    // 언어 버튼 업데이트
    document.getElementById('toggleLanguage').textContent = appState.language.toUpperCase();
    
    // 페이지 제목 번역
    document.title = translations[appState.language].title;
    
    // UI 요소 번역
    translateUI();
  }
  
  // 다크 모드 토글
  function toggleDarkMode() {
    appState.isDarkMode = !appState.isDarkMode;
    applyTheme();
    saveStateToLocalStorage();
  }
  
  // 언어 토글
  function toggleLanguage() {
    appState.language = appState.language === 'ko' ? 'en' : 'ko';
    applyTheme();
    saveStateToLocalStorage();
  }
  
  // UI 요소 번역
  function translateUI() {
    const t = translations[appState.language];
    
    // 헤더
    document.querySelector('.title').textContent = t.title;
    
    // 검색 폼
    document.querySelector('.section-title').textContent = t.searchTitle;
    document.querySelector('.section-description').textContent = t.searchDescription;
    document.querySelector('.form-label').innerHTML = `${t.ingredientLabel} <span class="required">*</span>`;
    document.getElementById('ingredient').placeholder = t.ingredientPlaceholder;
    document.querySelector('.form-text').textContent = t.apiInfo;
    document.querySelector('.btn-primary span').textContent = t.search;
    
    // 검색 결과
    if (document.getElementById('resultsCount').textContent) {
      document.getElementById('resultsCount').textContent = `${appState.searchResults.length} ${t.resultsCount}`;
    }
    
    // 로딩 상태
    document.querySelector('.loading-state p').textContent = t.loading;
    
    // 빈 결과 상태
    document.querySelector('.empty-state h3').textContent = t.noResults;
    document.getElementById('newSearchBtn').textContent = t.newSearch;
    if (appState.searchTerm) {
      document.getElementById('emptyStateMessage').textContent = t.noResultsDescription.replace('{term}', appState.searchTerm);
    }
    
    // 오류 상태
    document.querySelector('.error-state h3').textContent = t.error;
    document.getElementById('errorMessage').textContent = t.apiError;
    document.getElementById('retryBtn').textContent = t.retry;
    
    // 모달 탭
    document.getElementById('tabIngredients').innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="8" y1="6" x2="21" y2="6"></line>
        <line x1="8" y1="12" x2="21" y2="12"></line>
        <line x1="8" y1="18" x2="21" y2="18"></line>
        <line x1="3" y1="6" x2="3.01" y2="6"></line>
        <line x1="3" y1="12" x2="3.01" y2="12"></line>
        <line x1="3" y1="18" x2="3.01" y2="18"></line>
      </svg>
      ${t.ingredients}
    `;
    
    document.getElementById('tabSteps').innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
        <path d="M2 17l10 5 10-5"></path>
        <path d="M2 12l10 5 10-5"></path>
      </svg>
      ${t.cookingSteps}
    `;
    
    document.getElementById('tabNutrition').innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
      ${t.nutritionInfo}
    `;
    
    document.getElementById('tabDetails').innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
      ${t.details}
    `;
    
    // 모달 내용
    document.querySelector('.match-ratio-header span:first-child').textContent = t.matchRatio;
    document.querySelector('.match-explanation').textContent = t.matchExplanation;
    document.querySelector('.ingredients-full-list h4').textContent = t.fullIngredientsList;
    
    const matchedPanelHeader = document.querySelector('.ingredients-panel.matched .ingredients-panel-header h4');
    matchedPanelHeader.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      ${t.matchedIngredients}
    `;
    
    const additionalPanelHeader = document.querySelector('.ingredients-panel.additional .ingredients-panel-header h4');
    additionalPanelHeader.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="16"></line>
        <line x1="8" y1="12" x2="16" y2="12"></line>
      </svg>
      ${t.additionalIngredients}
    `;
    
    // 조리 방법 없음 상태
    document.querySelector('#noCookingSteps h3').textContent = t.noCookingSteps;
    document.querySelector('#noCookingSteps p').textContent = t.noCookingStepsDesc;
    
    // 영양 정보 없음 상태
    document.querySelector('#noNutritionInfo h3').textContent = t.noNutritionInfo;
    document.querySelector('#noNutritionInfo p').textContent = t.noNutritionInfoDesc;
    
    // 상세 정보 패널
    document.querySelector('#foodCodeInfo h4').textContent = t.foodCode;
    document.querySelector('.details-panel:last-child h4').textContent = t.dataSource;
    document.querySelector('.details-panel:last-child p').textContent = t.koreaFDA;
    
    // 모달 푸터
    document.getElementById('closeModalBtn').textContent = t.close;
    document.getElementById('shareRecipeBtn').innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="18" cy="5" r="3"></circle>
        <circle cx="6" cy="12" r="3"></circle>
        <circle cx="18" cy="19" r="3"></circle>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
      </svg>
      ${t.share}
    `;
    
    // 즐겨찾기 버튼
    updateFavoriteButton();
  }
  
  // 이벤트 리스너 등록
  function registerEventListeners() {
    // 다크 모드 토글
    document.getElementById('toggleTheme').addEventListener('click', toggleDarkMode);
    
    // 언어 토글
    document.getElementById('toggleLanguage').addEventListener('click', toggleLanguage);
    
    // 검색 폼 제출
    document.getElementById('searchForm').addEventListener('submit', handleSearch);
    
    // 입력 지우기 버튼
    document.getElementById('clearInput').addEventListener('click', clearSearchInput);
    
    // 입력 필드 이벤트 (지우기 버튼 표시/숨김)
    document.getElementById('ingredient').addEventListener('input', toggleClearButton);
    
    // 새 검색 버튼
    document.getElementById('newSearchBtn').addEventListener('click', resetSearch);
    
    // 재시도 버튼
    document.getElementById('retryBtn').addEventListener('click', retrySearch);
    
    // 모달 닫기 버튼
    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
    document.querySelector('.modal-close-btn').addEventListener('click', closeModal);
    document.querySelector('.modal-overlay').addEventListener('click', closeModal);
    
    // 모달 탭 버튼들
    document.querySelectorAll('.tab-button').forEach(button => {
      button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');
        switchTab(tabId);
      });
    });
    
    // 공유 버튼
    document.getElementById('shareRecipeBtn').addEventListener('click', shareRecipe);
    
    // 즐겨찾기 버튼
    document.getElementById('favoriteBtn').addEventListener('click', toggleFavorite);
    
    // 정렬 버튼 이벤트 리스너
    document.getElementById('sortButton').addEventListener('click', changeSortBy);
  }
  
  // 최근 검색어 렌더링
  function renderRecentSearches() {
    const recentSearchesContainer = document.getElementById('recentSearches');
    recentSearchesContainer.innerHTML = '';
    
    if (appState.recentSearches.length === 0) {
      return;
    }
    
    appState.recentSearches.forEach(term => {
      const badge = document.createElement('span');
      badge.classList.add('recent-search');
      badge.textContent = term;
      badge.addEventListener('click', () => {
        document.getElementById('ingredient').value = term;
        handleSearch(null, term);
      });
      
      recentSearchesContainer.appendChild(badge);
    });
  }
  
  // 검색 결과 렌더링 함수
  function renderSearchResults() {
    const resultsGrid = document.getElementById('resultsGrid');
    resultsGrid.innerHTML = '';
    
    if (!appState.searchResults || appState.searchResults.length === 0) {
      showEmptyState();
      return;
    }
    
    // 검색어를 쉼표로 분리
    const searchTerms = appState.searchTerm.split(',').map(term => term.trim().toLowerCase());
    
    // 정렬을 위한 데이터 준비
    const sortedResults = appState.searchResults.map(food => {
      const title = food.getElementsByTagName('RCP_NM')[0]?.textContent || '';
      const ingredients = food.getElementsByTagName('RCP_PARTS_DTLS')[0]?.textContent || '';
      const ingredientsList = ingredients.split(',').map(ing => {
        const match = ing.trim().match(/^([^(]+)/);
        return match ? match[1].trim() : ing.trim();
      });
      
      const matchedIngredients = searchTerms.filter(term => 
        ingredientsList.some(ing => ing.toLowerCase().includes(term))
      );
      
      const matchRatio = (matchedIngredients.length / searchTerms.length) * 100;
      const possessionRatio = (matchedIngredients.length / ingredientsList.length) * 100;
      const calories = food.getElementsByTagName('NUTR_CONT1')[0]?.textContent || '0';
      const isFavorite = appState.favorites.some(fav => 
        fav.id === food.getElementsByTagName('RCP_SEQ')[0]?.textContent
      );
      
      return { 
        food, 
        matchRatio, 
        possessionRatio,
        title, 
        calories: parseFloat(calories) || 0,
        isFavorite 
      };
    });
    
    // 정렬 방식에 따라 정렬
    switch (appState.sortBy) {
      case 'matchRatio':
        sortedResults.sort((a, b) => {
          if (a.isFavorite !== b.isFavorite) return b.isFavorite - a.isFavorite;
          return b.matchRatio - a.matchRatio;
        });
        break;
      case 'possessionRatio':
        sortedResults.sort((a, b) => {
          if (a.isFavorite !== b.isFavorite) return b.isFavorite - a.isFavorite;
          return b.possessionRatio - a.possessionRatio;
        });
        break;
      case 'name':
        sortedResults.sort((a, b) => {
          if (a.isFavorite !== b.isFavorite) return b.isFavorite - a.isFavorite;
          return a.title.localeCompare(b.title);
        });
        break;
      case 'nameDesc':
        sortedResults.sort((a, b) => {
          if (a.isFavorite !== b.isFavorite) return b.isFavorite - a.isFavorite;
          return b.title.localeCompare(a.title);
        });
        break;
    }
    
    // 정렬된 결과 표시
    sortedResults.forEach(({ food }) => {
      const foodCard = createFoodCard(food);
      resultsGrid.appendChild(foodCard);
    });
    
    // 결과 개수 업데이트
    document.getElementById('resultsCount').textContent = 
      `${appState.searchResults.length}개의 음식 찾음`;
  }
  
  // 음식 카드 생성 함수
  function createFoodCard(food) {
    const template = document.getElementById('foodCardTemplate');
    const card = template.content.cloneNode(true);
    
    // 기본 정보 설정
    const title = food.getElementsByTagName('RCP_NM')[0]?.textContent || '';
    const imageUrl = food.getElementsByTagName('ATT_FILE_NO_MK')[0]?.textContent || '';
    const ingredients = food.getElementsByTagName('RCP_PARTS_DTLS')[0]?.textContent || '';
    const category = food.getElementsByTagName('RCP_PAT2')[0]?.textContent || '';
    const calories = food.getElementsByTagName('NUTR_CONT1')[0]?.textContent || '0';
    
    // 카드 요소 설정
    card.querySelector('.food-card-title').textContent = title;
    card.querySelector('.food-card-image').src = imageUrl;
    card.querySelector('.food-card-image').alt = title;
    
    // 칼로리 표시
    const caloriesElement = card.querySelector('.food-card-calories');
    if (calories && calories !== '0') {
      caloriesElement.textContent = `${calories} kcal`;
      caloriesElement.style.display = 'block';
    } else {
      caloriesElement.style.display = 'none';
    }
    
    // 검색어를 쉼표로 분리
    const searchTerms = appState.searchTerm.split(',').map(term => term.trim().toLowerCase());
    
    // 재료 정보 파싱
    const ingredientsList = ingredients.split(',').map(ing => {
      const match = ing.trim().match(/^([^(]+)/);
      return match ? match[1].trim() : ing.trim();
    });
    
    // 보유한 재료는 검색한 재료 중 레시피에 포함된 것만 표시
    const matchedIngredients = searchTerms.filter(term => 
      ingredientsList.some(ing => ing.toLowerCase().includes(term))
    );
    
    // 추가 필요 재료는 전체 재료에서 보유한 재료를 제외한 것
    const additionalIngredients = ingredientsList.filter(ing => 
      !searchTerms.some(term => ing.toLowerCase().includes(term))
    );
    
    // 일치율 계산 (검색한 재료 중 레시피에 포함된 재료의 비율)
    const matchRatio = (matchedIngredients.length / searchTerms.length) * 100;
    
    // 보유율 계산 (전체 재료 대비 보유한 재료의 비율)
    const possessionRatio = (matchedIngredients.length / ingredientsList.length) * 100;
    
    // 일치율과 보유율 표시
    const matchBadge = card.querySelector('.food-card-match-badge');
    matchBadge.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
        <line x1="9" y1="9" x2="9.01" y2="9"></line>
        <line x1="15" y1="9" x2="15.01" y2="9"></line>
      </svg>
      <div class="match-info">
        <div class="match-ratio">일치율: <span class="match-percent">${Math.round(matchRatio)}%</span></div>
        <div class="possession-ratio">보유율: <span class="possession-percent">${Math.round(possessionRatio)}%</span></div>
      </div>
    `;
    
    // 보유한 재료 표시
    const matchedIngredientsList = card.querySelector('.matched-ingredients');
    matchedIngredients.forEach(ing => {
      const ingElement = document.createElement('span');
      ingElement.className = 'ingredient-tag';
      ingElement.textContent = ing;
      matchedIngredientsList.appendChild(ingElement);
    });
    
    // 추가 필요 재료 표시
    const additionalIngredientsList = card.querySelector('.additional-ingredients');
    additionalIngredients.forEach(ing => {
      const ingElement = document.createElement('span');
      ingElement.className = 'ingredient-tag';
      ingElement.textContent = ing;
      additionalIngredientsList.appendChild(ingElement);
    });
    
    // 일치율 표시
    const matchPercentElements = card.querySelectorAll('.match-percent');
    matchPercentElements.forEach(el => {
      el.textContent = `${Math.round(matchRatio)}%`;
    });
    
    const progressElements = card.querySelectorAll('.progress');
    progressElements.forEach(el => {
      el.style.width = `${matchRatio}%`;
    });
    
    // 카테고리 배지 추가
    if (category) {
      const badgesContainer = card.querySelector('.food-card-badges');
      const categoryBadge = document.createElement('span');
      categoryBadge.className = 'food-card-badge';
      categoryBadge.textContent = category;
      badgesContainer.appendChild(categoryBadge);
    }
    
    // 이벤트 리스너 설정
    card.querySelector('.details-link').addEventListener('click', () => showFoodDetails(food));
    card.querySelector('.favorite-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFoodFavorite(food, e.currentTarget);
    });
    
    return card;
  }
  
  // 음식 상세 정보 표시
  function showFoodDetails(food) {
    appState.selectedFood = food;
    
    // 모달 헤더 정보 설정
    const imageUrl = food.getElementsByTagName('ATT_FILE_NO_MK')[0]?.textContent;
    const title = food.getElementsByTagName('RCP_NM')[0]?.textContent || '';
    const category = food.getElementsByTagName('RCP_PAT2')[0]?.textContent || '';
    
    if (imageUrl) {
      document.getElementById('modalImage').src = imageUrl;
      document.getElementById('modalImage').alt = title;
      document.getElementById('modalImage').parentElement.style.display = 'block';
    } else {
      document.getElementById('modalImage').parentElement.style.display = 'none';
    }
    
    document.getElementById('modalTitle').textContent = title;
    
    // 검색어를 쉼표로 분리
    const searchTerms = appState.searchTerm.split(',').map(term => term.trim().toLowerCase());
    
    // 재료 정보 파싱
    const ingredients = food.getElementsByTagName('RCP_PARTS_DTLS')[0]?.textContent || '';
    const ingredientsList = ingredients.split(',').map(ing => {
      const match = ing.trim().match(/^([^(]+)/);
      return match ? match[1].trim() : ing.trim();
    });
    
    // 보유한 재료는 검색한 재료 중 레시피에 포함된 것만 표시
    const matchedIngredients = searchTerms.filter(term => 
      ingredientsList.some(ing => ing.toLowerCase().includes(term))
    );
    
    // 추가 필요 재료는 전체 재료에서 보유한 재료를 제외한 것
    const additionalIngredients = ingredientsList.filter(ing => 
      !searchTerms.some(term => ing.toLowerCase().includes(term))
    );
    
    // 일치율 계산 (검색한 재료 중 레시피에 포함된 재료의 비율)
    const matchRatio = (matchedIngredients.length / searchTerms.length) * 100;
    document.getElementById('modalMatchPercent').textContent = `${Math.round(matchRatio)}%`;
    
    // 배지 영역
    const badgesContainer = document.getElementById('modalBadges');
    badgesContainer.innerHTML = '';
    
    // 카테고리 배지
    if (category) {
      const categoryBadge = document.createElement('span');
      categoryBadge.classList.add('modal-badge');
      categoryBadge.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
          <line x1="7" y1="7" x2="7.01" y2="7"></line>
        </svg>
        ${category}
      `;
      badgesContainer.appendChild(categoryBadge);
    }
    
    // 재료 정보 탭
    document.getElementById('fullIngredientsList').textContent = ingredients;
    
    // 보유한 재료 목록
    const matchedIngredientsList = document.getElementById('matchedIngredientsList');
    matchedIngredientsList.innerHTML = '';
    matchedIngredients.forEach(ing => {
      const ingElement = document.createElement('span');
      ingElement.className = 'ingredient-tag';
      ingElement.textContent = ing;
      matchedIngredientsList.appendChild(ingElement);
    });
    document.getElementById('matchedIngredientsCount').textContent = matchedIngredients.length;
    
    // 추가 필요 재료 목록
    const additionalIngredientsList = document.getElementById('additionalIngredientsList');
    additionalIngredientsList.innerHTML = '';
    additionalIngredients.forEach(ing => {
      const ingElement = document.createElement('span');
      ingElement.className = 'ingredient-tag';
      ingElement.textContent = ing;
      additionalIngredientsList.appendChild(ingElement);
    });
    document.getElementById('additionalIngredientsCount').textContent = additionalIngredients.length;
    
    // 조리 방법 탭
    const cookingStepsList = document.getElementById('cookingStepsList');
    cookingStepsList.innerHTML = '';
    
    // 모든 조리 단계 가져오기
    let hasSteps = false;
    for (let i = 1; i <= 20; i++) {
      const stepNum = i.toString().padStart(2, '0');
      const step = food.getElementsByTagName(`MANUAL${stepNum}`)[0]?.textContent;
      if (step && step.trim()) {
        hasSteps = true;
        const li = document.createElement('li');
        // 단계 번호에서 중복된 숫자 제거
        const stepNumber = i.toString().replace(/(\d+)\.\1/, '$1');
        li.textContent = `${stepNumber}. ${step.trim()}`;
        cookingStepsList.appendChild(li);
      }
    }
    
    if (hasSteps) {
      document.getElementById('noCookingSteps').classList.add('hidden');
    } else {
      document.getElementById('noCookingSteps').classList.remove('hidden');
    }
    
    // 영양 정보 탭
    showNutritionInfo(food);
    
    // 상세 정보 탭
    const foodCode = food.getElementsByTagName('RCP_SEQ')[0]?.textContent;
    if (foodCode) {
      document.getElementById('foodCode').textContent = foodCode;
      document.getElementById('foodCodeInfo').style.display = 'block';
    } else {
      document.getElementById('foodCodeInfo').style.display = 'none';
    }
    
    // 즐겨찾기 버튼 상태 업데이트
    updateFavoriteButton();
    
    // 모달 표시
    document.getElementById('detailModal').classList.add('open');
    document.body.style.overflow = 'hidden';
    
    // 처음 탭 활성화
    switchTab('ingredients');
  }
  
  // 영양 정보 표시 함수
  function showNutritionInfo(food) {
    const nutritionGrid = document.getElementById('nutritionGrid');
    nutritionGrid.innerHTML = '';
    
    // 영양 정보가 있는지 확인
    const hasNutritionInfo = food.getElementsByTagName('NUTR_CONT1')[0]?.textContent || 
                            food.getElementsByTagName('NUTR_CONT2')[0]?.textContent || 
                            food.getElementsByTagName('NUTR_CONT3')[0]?.textContent;
    
    if (hasNutritionInfo) {
      // 칼로리
      if (food.getElementsByTagName('NUTR_CONT1')[0]?.textContent) {
        nutritionGrid.appendChild(createNutritionItem('칼로리', food.getElementsByTagName('NUTR_CONT1')[0].textContent));
      }
      
      // 탄수화물
      if (food.getElementsByTagName('NUTR_CONT2')[0]?.textContent) {
        nutritionGrid.appendChild(createNutritionItem('탄수화물', food.getElementsByTagName('NUTR_CONT2')[0].textContent));
      }
      
      // 단백질
      if (food.getElementsByTagName('NUTR_CONT3')[0]?.textContent) {
        nutritionGrid.appendChild(createNutritionItem('단백질', food.getElementsByTagName('NUTR_CONT3')[0].textContent));
      }
      
      // 지방
      if (food.getElementsByTagName('NUTR_CONT4')[0]?.textContent) {
        nutritionGrid.appendChild(createNutritionItem('지방', food.getElementsByTagName('NUTR_CONT4')[0].textContent));
      }
      
      // 나트륨
      if (food.getElementsByTagName('NUTR_CONT5')[0]?.textContent) {
        nutritionGrid.appendChild(createNutritionItem('나트륨', food.getElementsByTagName('NUTR_CONT5')[0].textContent));
      }
    } else {
      document.getElementById('noNutritionInfo').classList.remove('hidden');
      nutritionGrid.classList.add('hidden');
    }
  }
  
  // 영양 정보 아이템 생성
  function createNutritionItem(label, value) {
    const item = document.createElement('div');
    item.classList.add('nutrition-item');
    
    const labelElement = document.createElement('div');
    labelElement.classList.add('nutrition-label');
    labelElement.textContent = label;
    
    const valueElement = document.createElement('div');
    valueElement.classList.add('nutrition-value');
    valueElement.textContent = value;
    
    item.appendChild(labelElement);
    item.appendChild(valueElement);
    
    return item;
  }
  
  // 즐겨찾기 버튼 상태 업데이트
  function updateFavoriteButton() {
    if (!appState.selectedFood) return;
    
    const favoriteBtn = document.getElementById('favoriteBtn');
    const foodId = appState.selectedFood.foodCode || appState.selectedFood.name;
    const isFavorite = appState.favorites.some(fav => fav.id === foodId);
    
    if (isFavorite) {
      favoriteBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        ${translations[appState.language].removeFromFavorites}
      `;
      favoriteBtn.classList.add('bg-red-500', 'hover:bg-red-600', 'text-white');
    } else {
      favoriteBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        ${translations[appState.language].addToFavorites}
      `;
      favoriteBtn.classList.remove('bg-red-500', 'hover:bg-red-600', 'text-white');
    }
  }
  
  // 즐겨찾기 토글
  function toggleFavorite() {
    if (!appState.selectedFood) return;
    
    const food = appState.selectedFood;
    const foodId = food.foodCode || food.name;
    const isFavorite = appState.favorites.some(fav => fav.id === foodId);
    
    if (isFavorite) {
      // 즐겨찾기 제거
      appState.favorites = appState.favorites.filter(fav => fav.id !== foodId);
      showToast(translations[appState.language].removedFromFavorites);
    } else {
      // 즐겨찾기 추가
      appState.favorites.push({
        id: foodId,
        name: food.name,
        category: food.category,
        imageUrl: food.imageUrl,
        dateAdded: new Date().toISOString()
      });
      showToast(translations[appState.language].addedToFavorites);
    }
    
    // 저장 및 업데이트
    saveStateToLocalStorage();
    updateFavoriteButton();
  }
  
  // 음식 즐겨찾기 토글 (카드에서)
  function toggleFoodFavorite(food, button) {
    const foodId = food.foodCode || food.name;
    const isFavorite = appState.favorites.some(fav => fav.id === foodId);
    
    if (isFavorite) {
      // 즐겨찾기 제거
      appState.favorites = appState.favorites.filter(fav => fav.id !== foodId);
      button.classList.remove('active');
      button.querySelector('svg').style.fill = 'transparent';
      showToast(translations[appState.language].removedFromFavorites);
    } else {
      // 즐겨찾기 추가
      appState.favorites.push({
        id: foodId,
        name: food.name,
        category: food.category,
        imageUrl: food.imageUrl,
        dateAdded: new Date().toISOString()
      });
      button.classList.add('active');
      button.querySelector('svg').style.fill = 'currentColor';
      showToast(translations[appState.language].addedToFavorites);
    }
    
    // 저장
    saveStateToLocalStorage();
    
    // 상세 모달이 열려있고 같은 음식인 경우 버튼 업데이트
    if (appState.selectedFood && (appState.selectedFood.foodCode === food.foodCode || appState.selectedFood.name === food.name)) {
      updateFavoriteButton();
    }
  }
  
  // 레시피 공유
  function shareRecipe() {
    if (!appState.selectedFood) return;
    
    const food = appState.selectedFood;
    const t = translations[appState.language];
    
    // 공유 텍스트 구성
    const recipeText = `
  🍳 ${food.name}
  🔖 ${food.category || t.recipe}
  📝 ${t.ingredients}: ${food.matchedIngredients?.join(', ') || ''} ${food.additionalIngredients?.length ? `(+ ${food.additionalIngredients.length} ${t.more})` : ''}
  ⚡ ${food.nutritionInfo?.calories ? `${food.nutritionInfo.calories} kcal` : ''}
    `;
    
    // SweetAlert으로 공유 옵션 표시
    Swal.fire({
      title: t.shareRecipe,
      html: `
        <div class="text-left p-2 mb-3 bg-gray-50 dark:bg-gray-800 rounded-md">
          <pre class="whitespace-pre-wrap">${recipeText}</pre>
        </div>
      `,
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: t.copyToClipboard,
      cancelButtonText: t.cancel,
      confirmButtonColor: '#4F46E5'
    }).then((result) => {
      if (result.isConfirmed) {
        navigator.clipboard.writeText(recipeText).then(() => {
          showToast(t.recipeCopiedToClipboard);
        });
      }
    });
  }
  
  // 토스트 메시지 표시
  function showToast(message) {
    Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    }).fire({
      icon: 'success',
      title: message
    });
  }
  
  // 탭 전환
  function switchTab(tabId) {
    // 모든 탭 버튼 비활성화
    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // 모든 탭 패널 숨김
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    
    // 선택한 탭 버튼 활성화
    document.getElementById(`tab${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`).classList.add('active');
    
    // 선택한 탭 패널 표시
    document.getElementById(`tabContent${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`).classList.add('active');
  }
  
  // 모달 닫기
  function closeModal() {
    document.getElementById('detailModal').classList.remove('open');
    document.body.style.overflow = ''; // 스크롤 복원
    appState.selectedFood = null;
  }
  
  // 로딩 상태 설정
  function setLoadingState(isLoading) {
    appState.isLoading = isLoading;
    
    if (isLoading) {
      document.getElementById('loadingState').classList.remove('hidden');
      document.getElementById('resultsGrid').classList.add('hidden');
      document.getElementById('emptyState').classList.add('hidden');
      document.getElementById('errorState').classList.add('hidden');
    } else {
      document.getElementById('loadingState').classList.add('hidden');
      document.getElementById('resultsGrid').classList.remove('hidden');
    }
  }
  
  // 검색 결과 표시
  function showSearchResults() {
    document.getElementById('searchResults').classList.remove('hidden');
  }
  
  // 빈 결과 상태 표시
  function showEmptyState() {
    hideAllStates();
    document.getElementById('emptyState').classList.remove('hidden');
    document.getElementById('emptyStateMessage').textContent = translations[appState.language].noResultsDescription.replace('{term}', appState.searchTerm);
  }
  
  // 오류 상태 표시
  function showErrorState() {
    hideAllStates();
    document.getElementById('errorState').classList.remove('hidden');
    document.getElementById('errorMessage').textContent = appState.error || translations[appState.language].apiError;
  }
  
  // 모든 상태 숨김
  function hideAllStates() {
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('emptyState').classList.add('hidden');
    document.getElementById('errorState').classList.add('hidden');
  }
  
  // 검색 초기화
  function resetSearch() {
    document.getElementById('ingredient').value = '';
    document.getElementById('searchResults').classList.add('hidden');
    appState.searchTerm = '';
    appState.searchResults = [];
    toggleClearButton();
  }
  
  // 검색 재시도
  function retrySearch() {
    if (appState.searchTerm) {
      handleSearch(null, appState.searchTerm);
    }
  }
  
  // 검색 입력 지우기
  function clearSearchInput() {
    document.getElementById('ingredient').value = '';
    document.getElementById('clearInput').style.display = 'none';
  }
  
  // 검색 입력 변경 시 지우기 버튼 표시/숨김
  function toggleClearButton() {
    const input = document.getElementById('ingredient');
    const clearBtn = document.getElementById('clearInput');
    
    if (input.value) {
      clearBtn.style.display = 'flex';
    } else {
      clearBtn.style.display = 'none';
    }
  }
  
  // 검색 처리 함수
  async function handleSearch(event, presetTerm = null) {
    if (event) {
      event.preventDefault();
    }
    
    const searchTerm = presetTerm || document.getElementById('ingredient').value.trim();
    if (!searchTerm) return;
    
    try {
      setLoadingState(true);
      hideAllStates();
      
      // API 호출
      const response = await fetch('http://openapi.foodsafetykorea.go.kr/api/0e2588a359a740fba99b/COOKRCP01/xml/1/1000');
      const data = await response.text();
      
      // XML 파싱
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "text/xml");
      
      // 검색어를 쉼표로 분리하여 배열로 변환
      const searchTerms = searchTerm.split(',').map(term => term.trim().toLowerCase());
      
      // 검색 결과 필터링 (하나라도 포함되면 표시)
      const items = xmlDoc.getElementsByTagName('row');
      const searchResults = Array.from(items).filter(item => {
        const recipeName = item.getElementsByTagName('RCP_NM')[0]?.textContent || '';
        const ingredients = item.getElementsByTagName('RCP_PARTS_DTLS')[0]?.textContent || '';
        
        // 하나라도 포함되어 있는지 확인
        return searchTerms.some(term => 
          recipeName.toLowerCase().includes(term) || 
          ingredients.toLowerCase().includes(term)
        );
      });
      
      // 상태 업데이트
      appState.searchTerm = searchTerm;
      appState.searchResults = searchResults;
      
      // 최근 검색어 업데이트
      if (!appState.recentSearches.includes(searchTerm)) {
        appState.recentSearches.unshift(searchTerm);
        if (appState.recentSearches.length > 5) {
          appState.recentSearches.pop();
        }
        saveStateToLocalStorage();
        renderRecentSearches();
      }
      
      // 결과 표시
      if (searchResults.length > 0) {
        renderSearchResults();
        showSearchResults();
      } else {
        showEmptyState();
      }
    } catch (error) {
      console.error('Search error:', error);
      appState.error = error;
      showErrorState();
    } finally {
      setLoadingState(false);
    }
  }
  
  // 정렬 방식 변경 함수
  function changeSortBy() {
    Swal.fire({
      title: '정렬 방식 선택',
      html: `
        <div class="sort-options">
          ${sortOptions.map(option => `
            <button class="sort-option ${appState.sortBy === option.id ? 'active' : ''}" 
                    data-sort="${option.id}">
              ${option.label} ${option.icon}
            </button>
          `).join('')}
        </div>
      `,
      showConfirmButton: false,
      showCloseButton: true,
      customClass: {
        popup: 'sort-popup'
      },
      didOpen: () => {
        document.querySelectorAll('.sort-option').forEach(button => {
          button.addEventListener('click', () => {
            const sortBy = button.dataset.sort;
            appState.sortBy = sortBy;
            renderSearchResults();
            Swal.close();
          });
        });
      }
    });
  }
  
  // 초기화 실행
  document.addEventListener('DOMContentLoaded', init);